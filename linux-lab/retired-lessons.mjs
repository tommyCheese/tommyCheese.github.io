// Old bookmarks lead to the retained lesson. Retired session states cannot be
// reused because the replacement has different files and goals.
export const retiredLessons = {
  'success-chain':'enter-projects',
  'starter-delivery':'new-readme',
  'recursive-backup':'copy-project',
  'incident-report':'save-errors',
  'developer-list':'filter-errors',
  'developer-column':'csv-column',
  'developer-sort':'unique-names',
  'deploy-service':'download-config',
  'delivery-start':'start-web',
  'delivery-enable':'boot-web',
  'delivery-archive':'create-archive',
  'release-ready':'private-file',
  'batch-arguments':'batch-files'
};
const retired = id => Object.hasOwn(retiredLessons, id);
export function retireLessonProgress(data) {
  const result = {...data};
  if (retired(data.current)) result.current = retiredLessons[data.current];
  if (data.learning && typeof data.learning === 'object' && !Array.isArray(data.learning)) {
    result.learning = Object.fromEntries(Object.entries(data.learning).filter(([id]) => !retired(id)));
  }
  for (const key of ['session','reviewSession']) {
    const session = data[key];
    if (session && (retired(session.lesson) || Array.isArray(session.exercise?.queue) && session.exercise.queue.some(retired))) {
      delete result[key];
      if (key === 'session' && data.mode === 'learn') result.mode = 'manual';
    }
  }
  return result;
}
