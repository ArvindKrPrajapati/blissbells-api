declare module "socket.io-parser" {
  export class Encoder {
    encode(obj: any, callback: (encodedPackets: any[]) => void): void;
  }
  export class Decoder {
    add(obj: any): void;
    on(event: string, callback: Function): void;
    destroy(): void;
  }
}
