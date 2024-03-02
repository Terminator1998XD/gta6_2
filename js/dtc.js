class DateTimeClock {
  constructor(seconds) {
    this.inner = new Date();
    this.seconds = seconds;
  }

  check() {
    const now = new Date();
    const x = (now - this.inner) / 1000 > this.seconds;

    if (x) this.inner = now;

    return x;
  }

  checkNoUpdate() {
    return (new Date() - this.inner) / 1000 > this.seconds;
  }

  getSecondsNoUpdate() {
    return this.seconds - (new Date() - this.inner) / 1000;
  }

  getProc()
  {
    const tmp = (new Date() - this.inner) / (this.seconds * 1000);

    return tmp >= 1 ? 1 : tmp;
  }

  checkWithDeltaSeconds() {
    const now = new Date();
    const deltaSeconds = (now - this.inner) / 1000;

    const x = deltaSeconds > this.seconds;

    if (x) this.inner = now;

    return [x, deltaSeconds];
  }

  checkWithPercentage() {
    const now = new Date();
    const percentage = (now - this.inner) / (this.seconds * 1000);

    const x = percentage >= 1;

    if (x) this.inner = now;

    return [x, percentage];
  }
}
