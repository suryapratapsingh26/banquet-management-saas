export default function AdminHeader() {
  const userName = localStorage.getItem("userName") || "Admin User";
  const userPhoto = localStorage.getItem("userPhoto");
  const initials = userName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();

  return (
    <header className="h-16 bg-pink-600 text-white flex items-center justify-between px-6 shadow-md">
      <div className="flex items-center gap-3 font-semibold">
        <span className="text-lg">Asyncotel Banquet</span>
        <span className="opacity-80 text-sm font-normal">| Admin Dashboard</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer">
          <span className="text-xl">🔔</span>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
            3
          </span>
        </div>

        <div className="flex items-center gap-3 cursor-pointer">
          {userPhoto ? (
            <img src={userPhoto} alt="Profile" className="w-8 h-8 rounded-full object-cover border-2 border-white/20" />
          ) : (
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm font-bold">
              {initials}
            </div>
          )}
          <span className="hidden md:block">{userName}</span>
        </div>
      </div>
    </header>
  );
}