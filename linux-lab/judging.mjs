import { Shell, evaluate, resolve } from './shell.mjs?v=20261020-judging-1';

// Reference solutions describe data origins, without requiring their command spelling.
export function prepareJudging(lesson, initial) {
  const reference = new Shell(initial.state, initial.manuals, initial.localizeContent);
  const goals = lesson.goals.map(({sources, ...goal}) => goal);
  const observations = goals.map(() => []);
  for (const command of lesson.solution) {
    const result = reference.execute(command);
    goals.forEach((goal,index) => {
      if (goal.type !== 'output') return;
      for (const output of result.outputs) {
        if (evaluate([goal],reference.state,output)[0].done) observations[index].push(output.sources);
      }
    });
  }
  lesson.goals.forEach((goal,index) => {
    delete goal.sources;
    if (goal.type === 'output') goal.sources = observations[index];
    if (goal.type === 'file' && (goal.text || goal.includes)) {
      const path = resolve(goal.path), node = reference.state.fs[path];
      if (node?.type === 'file') goal.sources = [node.sources ?? ['file:' + path]];
    }
  });
}
