import { Cell } from "ton";

const OFF_CHAIN_CONTENT_PREFIX = 0x01;

export function flattenSnakeCell(cell: any) {
  let c = cell;

  let res = Buffer.alloc(0);

  while (c) {
    let cs = c.beginParse();
    let data = cs.readRemainingBytes();
    res = Buffer.concat([res, data]);
    c = c.refs[0];
  }

  return res;
}

function bufferToChunks(buff: any, chunkSize: any) {
  let chunks = [];
  while (buff.byteLength > 0) {
    chunks.push(buff.slice(0, chunkSize));
    buff = buff.slice(chunkSize);
  }
  return chunks;
}

export function makeSnakeCell(data: any) {
  let chunks = bufferToChunks(data, 127);
  let rootCell = new Cell();
  let curCell = rootCell;

  for (let i = 0; i < chunks.length; i++) {
    let chunk = chunks[i];

    curCell.bits.writeBuffer(chunk);

    if (chunks[i + 1]) {
      let nextCell = new Cell();
      curCell.refs.push(nextCell);
      curCell = nextCell;
    }
  }

  return rootCell;
}

export function encodeOffChainContent(content: any) {
  let data = Buffer.from(content);
  let offChainPrefix = Buffer.from([OFF_CHAIN_CONTENT_PREFIX]);
  data = Buffer.concat([offChainPrefix, data]);
  return makeSnakeCell(data);
}

export function decodeOffChainContent(content: any) {
  let data = flattenSnakeCell(content);

  let prefix = data[0];
  if (prefix != OFF_CHAIN_CONTENT_PREFIX) {
    throw new Error(`Unknown content prefix: ${prefix.toString(16)}`);
  }
  return data.slice(1).toString();
}

export function decodeOffChainContentWithoutPrefix(content: any) {
  let data = flattenSnakeCell(content);

  // let prefix = data[0];
  // if (prefix != OFF_CHAIN_CONTENT_PREFIX) {
  // 	throw new Error(`Unknown content prefix: ${prefix.toString(16)}`);
  // }
  return data;
}

