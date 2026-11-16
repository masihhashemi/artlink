insert into public.skills (name, slug) values
  ('Videographer', 'videographer'),
  ('Writer', 'writer'),
  ('Script', 'script'),
  ('Photographer', 'photographer'),
  ('Illustrator', 'illustrator'),
  ('Designer', 'designer'),
  ('Painter', 'painter'),
  ('Animator', 'animator'),
  ('Editor', 'editor'),
  ('Musician', 'musician'),
  ('Actor', 'actor'),
  ('Director', 'director'),
  ('Curator', 'curator'),
  ('Sculptor', 'sculptor'),
  ('Producer', 'producer')
on conflict (slug) do nothing;
