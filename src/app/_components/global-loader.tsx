import { Spinner } from "./ui/spinner";

export default function GlobalLoader() {
  return (
    <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-center items-center">
      <Spinner className="size-9" />
    </div>
  );
}
