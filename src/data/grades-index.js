const gradeModules = {
  3: () => import('./grade3.js'),
};

export async function loadGradeData(grade) {
  const loader = gradeModules[grade];
  if (!loader) return [];
  const mod = await loader();
  return mod.grade3Kanji || mod.default || [];
}

export const availableGrades = Object.keys(gradeModules).map(Number);
