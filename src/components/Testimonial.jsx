import { TESTIMONIALS } from "@/lib/constants";

function Testimonial() {
  return (
    <div
      className="mx-auto mb-10 w-full max-w-[1200px] space-y-8 px-4 py-10 md:py-[104px] lg:px-10"
      id="testimonials"
    >
      <div className="mx-auto max-w-[1200px] space-y-8 text-center text-[#050215]">
        <h2 className="text-[32px] font-extrabold md:text-[44px]">
          Testimonials
        </h2>

        <p className="mx-auto max-w-[800px] text-[18px] font-light md:text-[20px]">
          Stories from people who have built reputations, earned rewards, and
          grown with Contribute.fi.
        </p>
      </div>

      <div className="scrollbar-hidden flex gap-8 overflow-x-scroll">
        {TESTIMONIALS.map((testimonial, i) => (
          <div
            key={i}
            className="w-full min-w-[300px] space-y-6 rounded-2xl bg-[#F7F9FD] px-6 py-8 sm:min-w-[392px]"
          >
            <div className="flex items-start justify-between">
              <img src={testimonial.image} alt="" />
              <img src="/Quotes.svg" alt="" />
            </div>

            <p className="font-normal text-[#636366]">{testimonial.message}</p>

            <div className="space-y-2">
              <p className="text-[20px] font-semibold text-[#050215]">
                {testimonial.name}
              </p>
              <p className="text-[18px] font-medium text-[#2F0FD1]">
                {testimonial.designation}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonial;
