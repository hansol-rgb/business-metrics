import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <h2 className="text-xl font-bold">페이지를 찾을 수 없습니다</h2>
      <p className="text-sm text-muted-foreground">
        요청하신 페이지가 존재하지 않습니다.
      </p>
      <Link
        href="/"
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
      >
        홈으로 이동
      </Link>
    </div>
  );
}
