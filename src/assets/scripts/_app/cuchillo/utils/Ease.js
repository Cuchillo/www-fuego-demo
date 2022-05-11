import gsap from "gsap";
import CustomEase from 'gsap/CustomEase';
gsap.registerPlugin(CustomEase);

const Ease = {
  EASE_CUCHILLO_IN_OUT: "EASE_CUCHILLO_IN_OUT",
  EASE_CUCHILLO_OUT: "EASE_CUCHILLO_OUT",
  EASE_IN_OUT: "EASE_IN_OUT",
  EASE_IN_OUT2: "EASE_IN_OUT2",
};

CustomEase.create(Ease.EASE_CUCHILLO_IN_OUT, "M0,0 C0.5,0 0.1,1 1,1");
CustomEase.create(Ease.EASE_CUCHILLO_OUT, "M0,0c0.2,0.6,0.1,1,1,1");
CustomEase.create(Ease.EASE_IN_OUT, ".76,0,.32,.99");
CustomEase.create(Ease.EASE_IN_OUT2, ".46,.06,.56,.9");

export { Ease }
