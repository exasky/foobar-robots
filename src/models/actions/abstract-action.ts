export abstract class AbstractAction {
  isStarted = false;

  protected constructor(
      protected timeToComplete: number,
      protected name: string
  ) {
  }

  // TODO before action
  // TODO after action

  getActionName(): string {
    return this.name;
  }

  getTimeToComplete(): number {
    return this.timeToComplete;
  }

  startAction(): void {
    if (this.completionPossible()) {

    }
    return;
  }

  // Can do better here because it would be great to be able to check completion of action before instantiate it
  completionPossible(): boolean {
    return true;
  }

  getCompletionNotPossibleMessage(): string {
    return "";
  }

  completeAction(): void {
    if (!this.completionPossible()) {
      console.warn(
          `Cannot complete action '${
              this.name
          }'. Reason: '${this.getCompletionNotPossibleMessage()}'`
      );
    } else {
      this.internalCompleteAction();
      console.log(`YaY action '${this.name}' complete !`);
    }
  }

  protected abstract internalCompleteAction(): void;
}
