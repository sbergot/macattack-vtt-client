import type { TokenData } from "../types/token";

type TokenRowProps = {
  token: TokenData;
  isSelected: boolean;
  onSelect: (tokenId: string) => void;
};

export function TokenRow({ token, isSelected, onSelect }: TokenRowProps) {
  return (
    <li
      className={`flex cursor-pointer items-center gap-3.5 rounded-2xl px-3.5 py-3 transition-colors ${
        isSelected ? "bg-amber-400/20 ring-1 ring-amber-300/60" : "bg-white/5"
      }`}
      onClick={() => onSelect(token.id)}
    >
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