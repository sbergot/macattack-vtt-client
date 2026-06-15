import type { TokenData } from "../types/token";

type TokenRowProps = {
  token: TokenData;
};

export function TokenRow({ token }: TokenRowProps) {
  return (
    <li className="flex items-center gap-3.5 rounded-2xl bg-white/5 px-3.5 py-3">
      <span
        className="grid h-10.5 w-10.5 place-items-center rounded-full font-bold text-slate-50"
        style={{ backgroundColor: token.color }}
      >
        {token.label}
      </span>
      <div>
        <strong className="block">{token.id}</strong>
        <p className="m-0">
          x: {token.x}, y: {token.y}, angle: {token.angle}
        </p>
      </div>
    </li>
  );
}