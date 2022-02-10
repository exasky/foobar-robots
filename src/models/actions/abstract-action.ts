export abstract class AbstractAction {
  protected constructor(protected timeToComplete: number, protected name: string) {}

  getActionName(): string {
    return this.name;
  }

  getTimeToComplete() {
    return this.timeToComplete;
  }

  // Can do better here because it would be great to be able to check completion of action before instanciate it
  completionPossible(): boolean {
    return true;
  }

  getCompletionNotPossibleMessage(): string {
    return '';
  }

  completeAction(): void {
    if (!this.completionPossible()) {
      console.warn(`Cannot complete action '${this.name}'. Reason: '${this.getCompletionNotPossibleMessage()}'`);
    } else {
      this.internalCompleteAction();
      console.log(`YaY action '${this.name}' complete !`)
    }
  }

  protected abstract internalCompleteAction(): void;
}
