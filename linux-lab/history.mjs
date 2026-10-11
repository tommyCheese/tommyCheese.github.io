const copy = value => structuredClone(value);
export class PracticeHistory {
  constructor(limit = 40) { this.limit = limit; this.clear(); }
  clear() { this.past = []; this.future = []; }
  record(state) { this.past.push(copy(state)); if (this.past.length > this.limit) this.past.shift(); this.future = []; }
  undo(current) { if (!this.past.length) return; this.future.push(copy(current)); return this.past.pop(); }
  redo(current) { if (!this.future.length) return; this.past.push(copy(current)); return this.future.pop(); }
}
