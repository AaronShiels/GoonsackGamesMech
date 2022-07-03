const timestampSeconds = (): number => Date.now() / 1000;
const timestampMilliseconds = (): number => Date.now();

export { timestampSeconds, timestampMilliseconds };
