export function slugify(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function deslugify(slug: string, knownNames: string[]): string | undefined {
  return knownNames.find(name => slugify(name) === slug);
}
