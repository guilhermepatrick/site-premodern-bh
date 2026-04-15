// Gera o SQL de importacao do historico a partir de scripts/_historico.json.
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const data = JSON.parse(readFileSync(resolve('scripts/_historico.json'), 'utf8'));

function normalize(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const payload = data.map((stage) => ({
  name: stage.name,
  date: stage.date,
  rounds: 4,
  participants: stage.participants.map((p) => ({
    position: p.position,
    name: p.name,
    normalized_name: normalize(p.name),
    points: p.points,
  })),
}));

const sql = `
do $$
declare
  v_season_id uuid;
  v_stage_id uuid;
  v_player_id uuid;
  v_stage jsonb;
  v_participant jsonb;
  v_data jsonb := $json$${JSON.stringify(payload)}$json$::jsonb;
begin
  select id into v_season_id from seasons where is_active order by created_at desc limit 1;
  if v_season_id is null then
    raise exception 'Nenhuma temporada ativa.';
  end if;

  for v_stage in select * from jsonb_array_elements(v_data)
  loop
    insert into stages (season_id, name, event_date, rounds)
    values (v_season_id, v_stage->>'name', (v_stage->>'date')::date, (v_stage->>'rounds')::int)
    returning id into v_stage_id;

    for v_participant in select * from jsonb_array_elements(v_stage->'participants')
    loop
      insert into players (name, normalized_name)
      values (v_participant->>'name', v_participant->>'normalized_name')
      on conflict (normalized_name) do update set name = excluded.name
      returning id into v_player_id;

      insert into stage_results (stage_id, player_id, position, points)
      values (
        v_stage_id,
        v_player_id,
        (v_participant->>'position')::int,
        (v_participant->>'points')::int
      );
    end loop;
  end loop;
end $$;
`;

writeFileSync(resolve('scripts/_import.sql'), sql);
console.log('SQL gerado: scripts/_import.sql');
console.log(`${payload.length} etapas, ${payload.reduce((a, s) => a + s.participants.length, 0)} participacoes.`);
