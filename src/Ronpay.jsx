import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Check,
  Globe2,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Wallet,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: QrCode,
    title: "Payment links",
    description:
      "Create secure payment requests and share them instantly with customers.",
  },
  {
    icon: Wallet,
    title: "Smart wallet",
    description:
      "Receive, hold, and manage balances from a simple wallet experience.",
  },
  {
    icon: Banknote,
    title: "Fiat or digital dollars",
    description:
      "Let users settle in local currency or keep funds in stable digital dollars.",
  },
  {
    icon: ShieldCheck,
    title: "Secure access",
    description:
      "Email and passkey access give users a simple and protected account experience.",
  },
];

const steps = [
  "Create a payment request",
  "Share the link or QR code",
  "Customer completes payment",
  "Receive funds in fiat or digital dollars",
];

const benefits = [
  "No seed phrases",
  "No wallet complexity",
  "Fast payment requests",
  "Stable-value savings",
  "Simple payout experience",
  "Built for mobile-first users",
];

export default function Ronpay() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white">
              <svg
                className="h-8 w-auto"
                viewBox="0 0 180 180"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M63.6258 13.035C65.4942 13.0367 67.3626 13.0366 69.2311 13.0349C73.1295 13.0365 77.0273 13.0551 80.9256 13.0867C85.9029 13.1265 90.8796 13.1308 95.8571 13.1233C99.7092 13.1202 103.561 13.1324 107.413 13.1494C109.248 13.1564 111.083 13.1596 112.917 13.1587C115.487 13.1605 118.055 13.182 120.624 13.2088C121.369 13.2059 122.115 13.2029 122.882 13.1999C133.122 13.3632 141.786 17.5046 149.219 24.4451C151.062 26.4197 152.659 28.4646 154.274 30.6287C154.733 31.2389 155.192 31.849 155.666 32.4776C160.718 40.6981 159.993 49.8302 159.871 59.1505C159.837 62.0563 159.85 64.9591 159.87 67.8651C159.859 82.4427 158.086 93.7012 147.497 104.43C142.386 109.143 136.574 113.655 130.274 116.629C127.946 116.316 127.946 116.316 126.274 115.629C126.274 114.969 126.274 114.309 126.274 113.629C125.743 113.425 125.212 113.221 124.665 113.012C121.245 111.034 118.761 108.325 116.024 105.504C115.47 104.94 114.916 104.377 114.345 103.797C112.983 102.412 111.628 101.021 110.274 99.6287C112.198 94.3808 116.923 92.1062 121.329 89.0428C126.338 84.9371 129.859 79.5577 130.549 73.0291C130.577 70.0619 130.596 67.0961 130.587 64.1287C130.603 63.0962 130.619 62.0636 130.636 60.9998C130.8 53.7197 130.8 53.7197 127.274 47.6287C122.924 45.0582 119.736 44.2512 114.706 44.2405C112.778 44.2264 112.778 44.2264 110.812 44.2119C109.423 44.2173 108.034 44.2234 106.645 44.2303C105.209 44.2283 103.772 44.2254 102.335 44.2216C99.3316 44.2172 96.3285 44.2236 93.3252 44.2376C89.4829 44.2547 85.6411 44.2448 81.7988 44.2269C78.8348 44.216 75.8708 44.2195 72.9068 44.2273C71.4902 44.2293 70.0737 44.2268 68.6572 44.2198C66.6759 44.2122 64.6946 44.2259 62.7134 44.2405C61.5879 44.2429 60.4624 44.2453 59.3027 44.2478C55.0212 44.7863 52.5805 46.3951 49.484 49.3194C47.7279 52.6715 47.8723 55.8856 47.9177 59.5784C47.9157 60.3756 47.9137 61.1728 47.9116 61.9941C47.9085 64.6251 47.927 67.2556 47.9461 69.8865C47.9491 71.7145 47.951 73.5424 47.9517 75.3704C47.9563 79.1986 47.9708 83.0266 47.9929 86.8548C48.0213 91.769 48.0322 96.683 48.0366 101.597C48.0408 105.37 48.0506 109.143 48.0625 112.916C48.0682 114.728 48.073 116.541 48.0768 118.353C48.0836 120.882 48.0972 123.41 48.1131 125.938C48.1142 126.691 48.1153 127.444 48.1164 128.22C48.0819 132.052 48.0819 132.052 49.2742 135.629C54.2835 136.157 57.14 136.168 61.1961 133.039C62.4888 131.942 63.7647 130.826 65.0242 129.691C66.3056 128.572 67.5919 127.459 68.8836 126.351C69.4401 125.854 69.9967 125.356 70.5701 124.844C72.4952 123.471 73.9329 122.926 76.2742 122.629C78.1336 124.035 78.1336 124.035 80.0242 126.129C83.3755 129.712 86.8526 132.934 90.6101 136.086C92.2742 137.629 92.2742 137.629 94.2742 140.629C60.8192 167.057 60.8192 167.057 44.2742 165.629C33.9591 163.272 27.2221 156.601 21.5008 148.035C18.3443 141.843 17.9829 136.074 18.0154 129.256C18.0119 128.343 18.0084 127.43 18.0048 126.489C17.996 123.486 18.0018 120.483 18.0086 117.48C18.0072 115.382 18.0053 113.284 18.0028 111.185C17.9998 106.792 18.0041 102.4 18.0134 98.0067C18.0248 92.3926 18.0183 86.7787 18.0063 81.1646C17.9991 76.8322 18.0014 72.4998 18.0066 68.1673C18.0079 66.0982 18.0063 64.0291 18.0016 61.96C17.9965 59.0599 18.0043 56.1601 18.0154 53.2601C18.0114 52.4151 18.0073 51.5701 18.0031 50.6996C18.0872 38.7526 21.4792 30.7439 29.4617 21.8787C39.597 12.646 50.712 12.9088 63.6258 13.035Z"
                  fill="url(#paint0_linear_1822_12904)"
                />
                <path
                  d="M96.2734 65.6222C98.2734 68.6222 98.2734 68.6222 97.9609 71.6847C97.2734 74.6222 97.2734 74.6222 96.2734 76.6222C96.122 79.22 96.0421 81.7732 96.0234 84.3722C96.0028 85.076 95.9822 85.7798 95.9609 86.505C95.9169 92.426 97.3248 96.3507 101.254 100.931C101.982 101.633 102.711 102.336 103.461 103.06C104.261 103.834 105.062 104.609 105.887 105.407C108.572 107.9 111.327 110.294 114.109 112.677C116.763 115.062 119.268 117.583 121.773 120.122C124.765 123.154 127.765 126.124 131.023 128.872C135.878 133.005 140.276 137.6 144.758 142.126C148.63 146.022 152.545 149.795 156.758 153.325C161.214 157.139 161.214 157.139 161.586 160.185C161.273 162.622 161.273 162.622 159.273 164.622C154.965 165.248 150.621 165.225 146.273 165.31C145.078 165.376 143.884 165.442 142.652 165.511C135.818 165.627 131.884 165.013 126.711 160.36C125.214 158.797 123.735 157.218 122.273 155.622C120.621 154.106 118.956 152.604 117.273 151.122C116.441 150.372 115.608 149.622 114.75 148.849C113.165 147.423 111.576 146.001 109.984 144.583C104.008 139.246 98.1548 133.785 92.3225 128.292C89.1547 125.311 85.9799 122.341 82.7539 119.423C81.9464 118.692 81.9464 118.692 81.1226 117.946C79.6929 116.656 78.2587 115.371 76.8242 114.087C69.8319 107.33 65.1706 100.63 64.7109 90.6847C64.98 83.6446 67.198 78.0052 71.9531 72.7745C73.6539 71.2362 75.382 69.9158 77.2734 68.6222C78.5728 67.694 78.5728 67.694 79.8984 66.7472C85.1861 64.9846 90.7585 64.8452 96.2734 65.6222Z"
                  fill="url(#paint1_linear_1822_12904)"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_1822_12904"
                    x1="89.793"
                    y1="13"
                    x2="89.793"
                    y2="166.117"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#2B6AF3" />
                    <stop offset="1" stop-color="#5ECBA1" />
                  </linearGradient>
                  <linearGradient
                    id="paint1_linear_1822_12904"
                    x1="89.793"
                    y1="13"
                    x2="89.793"
                    y2="166.117"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stop-color="#2D6CE6" />
                    <stop offset="1" stop-color="#59C1A4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="text-xl font-black tracking-tight">RonPay</span>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a href="#features" className="hover:text-slate-950">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-slate-950">
              How it works
            </a>
            <a href="#security" className="hover:text-slate-950">
              Security
            </a>
          </nav>

          <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800">
            Join waitlist
          </button>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="absolute top-32 right-0 h-[360px] w-[360px] rounded-full bg-emerald-200/40 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-extrabold tracking-wide text-slate-600 uppercase">
                Smart payments
              </span>
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-xs font-extrabold tracking-wide text-emerald-700 uppercase">
                Stable savings
              </span>
            </div>

            <h1 className="max-w-3xl text-5xl font-black tracking-tight text-slate-950 md:text-7xl">
              Payments, savings, and seamless digital settlements.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              RonPay lets users create payment links, receive funds in fiat or
              digital dollars, and keep stable savings from one simple wallet.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 font-bold text-white shadow-sm transition hover:bg-slate-800">
                Get early access
                <ArrowRight size={18} />
              </button>

              <button className="rounded-2xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-950 shadow-sm transition hover:bg-slate-100">
                View product
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm font-semibold text-slate-500">
              <span className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600" />
                No seed phrases
              </span>
              <span className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600" />
                Fiat and USDC
              </span>
              <span className="flex items-center gap-2">
                <Check size={16} className="text-emerald-600" />
                Mobile-first
              </span>
            </div>
          </div>

          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[36px] border border-slate-200 bg-white p-4 shadow-2xl shadow-slate-200">
              <div className="overflow-hidden rounded-[28px] bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-400">
                    Available balance
                  </span>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold">
                    Active
                  </span>
                </div>

                <p className="mt-4 text-5xl font-black">$1,240.55</p>

                <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                    New payment link
                  </p>
                  <p className="mt-2 text-2xl font-black">$250.00</p>
                  <p className="mt-1 text-sm text-slate-400">Design services</p>

                  <div className="mt-5 flex items-center justify-between rounded-2xl bg-white p-4 text-slate-950">
                    <div>
                      <p className="text-xs font-bold text-slate-400">
                        Payment QR
                      </p>
                      <p className="mt-1 text-sm font-black">Ready to share</p>
                    </div>
                    <QrCode size={42} />
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Pending
                  </p>
                  <p className="mt-2 text-2xl font-black">$500</p>
                </div>
                <div className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                  <p className="text-xs font-bold text-slate-400 uppercase">
                    Savings
                  </p>
                  <p className="mt-2 text-2xl font-black">$740</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="font-bold tracking-wide text-emerald-700 uppercase">
            One wallet experience
          </p>
          <h2 className="mt-3 text-4xl font-black tracking-tight">
            Built for people who want payments without complexity.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <feature.icon size={22} />
              </div>
              <h3 className="mt-5 text-lg font-black">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2">
          <div>
            <p className="font-bold tracking-wide text-sky-700 uppercase">
              How it works
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-tight">
              From request to settlement in a few simple steps.
            </h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">
              RonPay keeps the experience simple for users while handling wallet
              and settlement preferences behind the scenes.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 font-black text-white">
                  {index + 1}
                </div>
                <p className="font-bold text-slate-900">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[40px] bg-slate-950 p-8 text-white md:p-12">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/10">
                <LockKeyhole size={26} />
              </div>

              <h2 className="mt-6 text-4xl font-black tracking-tight">
                Secure access without wallet friction.
              </h2>

              <p className="mt-4 text-lg leading-8 text-slate-300">
                RonPay supports familiar account access with email and passkeys,
                while giving users a clean wallet experience for payments,
                payouts, and savings.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <BadgeCheck size={18} className="text-emerald-300" />
                  <span className="text-sm font-bold">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-[40px] border border-slate-200 bg-white p-8 text-center shadow-sm md:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-700">
            <Sparkles size={26} />
          </div>

          <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-black tracking-tight">
            Start with smarter payments. Grow into stable savings.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            RonPay gives users a simple way to receive, settle, and save value
            across fiat and digital dollars.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 font-bold text-white shadow-sm transition hover:bg-slate-800">
              Join waitlist
              <ArrowRight size={18} />
            </button>
            <button className="rounded-2xl border border-slate-200 bg-white px-6 py-4 font-bold text-slate-950 transition hover:bg-slate-50">
              Contact sales
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 font-black text-white">
              R
            </div>
            <span className="font-bold text-slate-950">RonPay</span>
          </div>

          <div className="flex flex-wrap gap-5">
            <span className="flex items-center gap-2">
              <Smartphone size={16} />
              Mobile-first
            </span>
            <span className="flex items-center gap-2">
              <Globe2 size={16} />
              Fiat & digital dollars
            </span>
            <span className="flex items-center gap-2">
              <Zap size={16} />
              Fast settlement
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
