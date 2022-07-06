export class OffsetResolverFactory {
  static create(offset: Array<number|string> | number | string) {
    return new OffsetResolver(offset);
  }
}

export class OffsetResolver {
  constructor(private offset: Array<number|string>| number|string) {}

  normalizeOffset() {
    if (!Array.isArray(this.offset)) {
      return [this.offset, this.offset, this.offset, this.offset];
    }
    if (this.offset.length === 2) {
      return this.offset.concat(this.offset);
    } else if (this.offset.length === 3) {
      return this.offset.concat([this.offset[1]]);
    }
    return this.offset;
  }
}
