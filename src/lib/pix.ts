function crc16(payload: string) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) crc = (crc << 1) ^ 0x1021;
      else crc <<= 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function tlv(id: string, value: string) {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

export function buildPixPayload({
  pixKey,
  merchantName,
  merchantCity,
  amount,
  message,
}: {
  pixKey: string;
  merchantName: string;
  merchantCity: string;
  amount: string;
  message?: string;
}) {
  const gui = tlv("00", "BR.GOV.BCB.PIX");
  const key = tlv("01", pixKey);
  const add = message ? tlv("02", message) : "";
  const merchantAccountInfo = tlv("26", `${gui}${key}${add}`);

  const payloadSemCRC =
    tlv("00", "01") +
    tlv("01", "12") +
    merchantAccountInfo +
    tlv("52", "0000") +
    tlv("53", "986") +
    tlv("54", amount) +
    tlv("58", "BR") +
    tlv("59", merchantName) +
    tlv("60", merchantCity) +
    tlv("62", tlv("05", "***")) +
    "6304";

  const crc = crc16(payloadSemCRC);
  return payloadSemCRC + crc;
}
