const Hero = () => {
  return (
    <div className="flex flex-col justify-start items-start">
      <h1 className="text-3xl font-black max-w-md">
        Connect with your Doctor easier than ever
      </h1>
      <p className="mt-5 max-w-lg text-sm text-neutral-600">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime,
        repudiandae nobis voluptatem consequuntur quos delectus numquam saepe
        aut veniam omnis vero ipsam accusamus suscipit neque sit optio inventore
        atque nostrum?
      </p>

      <div className="flex gap-x-5 mt-10">
        <button className="bg-blue text-white border border-blue rounded-sm py-2 px-3 hover:bg-white hover:text-blue hover:border-blue">
          Primary Action
        </button>
        <button className="text-blue bg-white border rounded-sm px-3 py-2 border-blue hover:bg-blue hover:text-white hover:border hover:border-white">
          Secondary Action
        </button>
      </div>
    </div>
  );
};

export default Hero;