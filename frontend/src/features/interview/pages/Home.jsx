import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

const TYPED_WORDS = ["hired", "interviews", "noticed", "results"];

// --- Rotating resume flip-card (cycles through exactly 3 images) ---
// Defined OUTSIDE Home so it is not re-created (and therefore remounted)
// every time Home re-renders from the typewriter effect's state updates.
const RESUME_IMAGES = ["/resume1.png", "/resume2.png", "/resume3.png"];
const FLIP_INTERVAL_MS = 2500; // how long each image stays visible
const FLIP_DURATION_MS = 700; // must match the CSS transition duration below

const RotatingResumeStack = () => {
  const [frontIdx, setFrontIdx] = useState(0);
  const [backIdx, setBackIdx] = useState(1);
  const [flipped, setFlipped] = useState(false);

  // Trigger a flip on an interval
  useEffect(() => {
    const interval = setInterval(() => {
      setFlipped((f) => !f);
    }, FLIP_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // Once a face is rotated out of view, swap its image to the next
  // one in the sequence so the next flip reveals fresh content.
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (flipped) {
        setFrontIdx(() => (backIdx + 1) % RESUME_IMAGES.length);
      } else {
        setBackIdx(() => (frontIdx + 1) % RESUME_IMAGES.length);
      }
    }, FLIP_DURATION_MS);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped]);

  return (
    <div className="relative w-full h-[420px]" style={{ perspective: "1200px" }}>
      <div
        className="relative w-full h-full transition-transform ease-in-out"
        style={{
          transformStyle: "preserve-3d",
          transitionDuration: `${FLIP_DURATION_MS}ms`,
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Front face — no wrapper box styling, just the raw image */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img
            src={RESUME_IMAGES[frontIdx]}
            alt="Resume Example"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Back face — no wrapper box styling, just the raw image */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <img
            src={RESUME_IMAGES[backIdx]}
            alt="Resume Example"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

const ResultIconTime = () => (
  <svg className="w-8 h-8 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3M3.22302 14C4.13247 18.008 7.71683 21 12 21c4.9706 0 9-4.0294 9-9 0-4.97056-4.0294-9-9-9-3.72916 0-6.92858 2.26806-8.29409 5.5M7 9H3V5" />
  </svg>
);

const ResultIconApproved = () => (
  <svg className="w-8 h-8 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1v6M5 19v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1M10 3v4a1 1 0 0 1-1 1H5m14 9.006h-.335a1.647 1.647 0 0 1-1.647-1.647v-1.706a1.647 1.647 0 0 1 1.647-1.647L19 12M5 12v5h1.375A1.626 1.626 0 0 0 8 15.375v-1.75A1.626 1.626 0 0 0 6.375 12H5Zm9 1.5v2a1.5 1.5 0 0 1-1.5 1.5v0a1.5 1.5 0 0 1-1.5-1.5v-2a1.5 1.5 0 0 1 1.5-1.5v0a1.5 1.5 0 0 1 1.5 1.5Z" />
  </svg>
);

const ResultIconResume = () => (
  <svg className="w-8 h-8 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.35709 16V5.78571c0-.43393.34822-.78571.77777-.78571H18.5793c.4296 0 .7778.35178.7778.78571V16M5.35709 16h-1c-.55229 0-1 .4477-1 1v1c0 .5523.44771 1 1 1H20.3571c.5523 0 1-.4477 1-1v-1c0-.5523-.4477-1-1-1h-1M5.35709 16H19.3571M9.35709 8l2.62501 2.5L9.35709 13m4.00001 0h2" />
  </svg>
);

const Home = () => {
  const navigate = useNavigate();

  const [typed, setTyped] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = TYPED_WORDS[wordIndex];
    const delay = deleting ? 60 : 120;

    const timer = setTimeout(() => {
      if (!deleting) {
        setTyped(current.slice(0, charIndex + 1));
        if (charIndex + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1400);
        } else {
          setCharIndex((c) => c + 1);
        }
      } else {
        setTyped(current.slice(0, charIndex - 1));
        if (charIndex - 1 === 0) {
          setDeleting(false);
          setCharIndex(0);
          setWordIndex((w) => (w + 1) % TYPED_WORDS.length);
        } else {
          setCharIndex((c) => c - 1);
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [charIndex, deleting, wordIndex]);

  const BenefitIcon1 = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <g clipPath="url(#clip0_15123_29967)">
        <path d="M11.2741 24.5246C10.989 23.6405 6.49237 20.512 5.27097 19.9029C7.00264 18.6456 11.8028 13.89 12.8903 11.8446C13.9894 13.7715 18.5137 18.1715 20.2788 18.8364C17.5993 20.7324 14.3068 24.7201 13.3521 27.2656C13.2921 27.0712 11.3376 24.7201 11.2741 24.5246Z" fill="white" />
        <path d="M29.1912 15.8962C29.0203 15.3309 26.3224 13.3282 25.5893 12.9336C26.6283 12.129 29.5086 9.08459 30.1609 7.77631C30.8201 9.00993 33.5354 11.8256 34.594 12.251C32.9858 13.4669 31.0152 16.0171 30.438 17.6465C30.4022 17.5328 29.2293 16.0218 29.1912 15.8962Z" fill="white" />
        <path d="M24.369 18.4133C24.3643 18.5901 24.3218 18.7637 24.2443 18.9217C24.1465 19.1145 24.0067 19.2816 23.8357 19.4099C23.6647 19.5376 23.467 19.6224 23.2584 19.6576C16.3895 20.8853 14.6635 30.304 14.5816 30.8906C14.5585 31.047 14.5308 31.2035 14.4927 31.3563C14.3772 31.8102 13.8243 32.1171 13.3244 32.2143C12.8245 32.3115 12.6594 32.1586 12.3246 31.8232C11.3076 30.4687 11.5592 22.8904 4.70527 21.2894C3.25644 20.9517 1.07336 21.3178 1.25576 19.3483C1.31464 18.7131 1.99576 18.4003 2.57991 18.1182C3.34762 17.7556 5.79506 17.7627 8.16053 16.1191C9.23879 15.2717 10.2282 13.2121 11.2221 8.81327C11.2591 8.45776 11.647 7.28575 12.2981 7.09022C12.6014 7.00052 12.9246 7.01131 13.2217 7.12103C13.5214 7.23098 13.7799 7.43496 13.9605 7.70407C14.2676 8.15912 14.592 10.3289 14.9094 11.3658C15.7845 14.2313 17.0648 16.106 20.2661 16.817C21.019 16.9646 21.7831 17.0439 22.5496 17.0541C22.9085 17.0353 23.2674 17.093 23.6036 17.2235C23.8302 17.3214 24.0231 17.4865 24.1578 17.6975C24.2955 17.9095 24.369 18.1585 24.369 18.4133ZM12.8591 12.7926C12.5486 14.6887 11.1725 18.5591 7.30509 19.5237C6.8664 19.5462 10.1774 19.9716 11.4611 21.8001C12.3039 22.997 13.0947 26.0521 13.2413 26.4716C14.0702 23.3656 16.0039 20.6649 19.129 18.9181C16.3941 18.0365 13.5576 17.0801 12.8591 12.7926Z" fill="#1E2532" />
        <path d="M38.7304 12.1207C38.6484 11.546 38.062 11.3018 37.6348 11.1241L37.6175 11.117C37.3508 11.0308 37.0761 10.9736 36.7978 10.9463C36.0255 10.8278 34.8583 10.6607 33.7189 9.95207C32.9974 9.44132 32.5125 8.056 31.7021 5.13369C31.649 4.83032 31.3084 3.93324 30.7139 3.7863C30.4493 3.72204 30.1717 3.74527 29.9208 3.85266C29.6694 3.96027 29.457 4.1459 29.3135 4.38356C29.0653 4.79358 28.5851 6.66239 28.4915 7.03213C27.9339 9.2363 26.8568 10.4474 25.0016 10.9594C24.5014 11.0841 23.9915 11.1634 23.4778 11.1964C23.1918 11.1966 22.909 11.2584 22.6477 11.3777C22.4493 11.4758 22.284 11.6326 22.1732 11.828C22.0621 12.025 22.0103 12.2514 22.0243 12.4786C22.0358 12.6396 22.0824 12.7959 22.1606 12.936C22.2543 13.0998 22.3834 13.2393 22.5381 13.3437C22.7945 13.4925 23.0705 13.6023 23.3577 13.6695C28.0667 14.2621 28.9545 18.8588 29.1173 20.813V20.8355C29.1369 20.9303 29.1635 21.0559 29.2015 21.1803C29.3297 21.5987 29.8169 21.8475 30.2406 21.9091C30.301 21.9182 30.3619 21.923 30.423 21.9234C30.7693 21.9234 30.9494 21.729 31.141 21.5169L31.156 21.4956C31.343 21.2206 31.4527 20.7324 31.6051 20.0569C32.045 18.1135 32.7803 14.8593 36.2171 13.8698C36.4553 13.8087 36.6966 13.7608 36.9398 13.7264C37.8264 13.5878 38.9139 13.4136 38.7304 12.1207ZM33.4984 12.5201C32.4225 12.9277 31.6744 13.4527 31.2749 14.0855C30.9182 14.6484 30.6181 15.6604 30.3837 16.5812C29.8065 14.62 29.1531 13.3188 26.8118 12.4715C28.1522 11.9512 29.6853 11.2058 30.2752 8.70304C30.4929 9.32574 30.782 9.91967 31.1364 10.4723C31.7794 11.4689 32.5748 12.1562 33.4984 12.5201Z" fill="#1E2532" />
        <path d="M24.2039 25.1171V27.6246C24.2085 27.9926 24.3507 28.3447 24.6011 28.6082C24.8553 28.8683 25.1997 29.0144 25.5587 29.0144C25.9177 29.0144 26.262 28.8683 26.5163 28.6082C26.765 28.3437 26.9066 27.9922 26.9123 27.6246V25.1171C26.9079 24.749 26.7657 24.3968 26.5151 24.1335C26.3895 24.0042 26.2402 23.9017 26.0759 23.8317C25.9116 23.7618 25.7354 23.7258 25.5575 23.7258C25.3796 23.7258 25.2035 23.7618 25.0392 23.8317C24.8748 23.9017 24.7256 24.0042 24.5999 24.1335C24.3512 24.3979 24.2096 24.7495 24.2039 25.1171Z" fill="#1E2532" />
        <path d="M31.1387 29.3228H28.7421C28.3835 29.3269 28.0402 29.4729 27.7839 29.7304C27.5304 29.9914 27.3881 30.3449 27.3881 30.7134C27.3881 31.0819 27.5304 31.4354 27.7839 31.6964C28.0415 31.9517 28.384 32.097 28.7421 32.1029H31.1387C31.4969 32.0982 31.8396 31.9522 32.0958 31.6952C32.2217 31.5662 32.3215 31.413 32.3897 31.2443C32.4579 31.0756 32.4929 30.8948 32.4929 30.7122C32.4929 30.5296 32.4579 30.3488 32.3897 30.1801C32.3215 30.0114 32.2217 29.8582 32.0958 29.7292C31.8386 29.474 31.4964 29.3287 31.1387 29.3228Z" fill="#1E2532" />
        <path d="M24.197 33.7241V36.1107C24.2011 36.4783 24.3429 36.83 24.593 37.0931C24.7187 37.2224 24.8679 37.3249 25.0322 37.3949C25.1966 37.4648 25.3727 37.5008 25.5506 37.5008C25.7285 37.5008 25.9046 37.4648 26.069 37.3949C26.2333 37.3249 26.3825 37.2224 26.5082 37.0931C26.7574 36.8294 26.8994 36.4781 26.9053 36.1107V33.7241C26.901 33.356 26.7588 33.0038 26.5082 32.7405C26.3825 32.6112 26.2333 32.5087 26.069 32.4387C25.9046 32.3688 25.7285 32.3328 25.5506 32.3328C25.3727 32.3328 25.1966 32.3688 25.0322 32.4387C24.8679 32.5087 24.7187 32.6112 24.593 32.7405C24.3439 33.0047 24.2022 33.3564 24.197 33.7241Z" fill="#1E2532" />
        <path d="M22.6142 29.0573H20.1749C19.8165 29.0625 19.4736 29.2083 19.2167 29.4649C18.9657 29.7278 18.8237 30.0804 18.8207 30.4485C18.822 30.8166 18.9642 31.1695 19.2167 31.4309C19.4742 31.6865 19.8167 31.8323 20.1749 31.8385H22.6142C22.9727 31.8333 23.3155 31.6875 23.5724 31.4309C23.8246 31.1693 23.9682 30.8176 23.973 30.4497C23.9718 30.0815 23.8296 29.7287 23.5771 29.4673C23.3196 29.2116 22.9771 29.0659 22.6189 29.0596L22.6142 29.0573Z" fill="#1E2532" />
      </g>
      <defs>
        <clipPath id="clip0_15123_29967">
          <rect width="37.5" height="33.75" fill="white" transform="translate(1.25 3.75073)" />
        </clipPath>
      </defs>
    </svg>
  );

  const BenefitIcon2 = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <g clipPath="url(#clip0_15111_23063)">
        <path d="M3.84758 23.5518C3.07909 15.0353 6.86564 6.47868 14.6499 4.30985C23.7927 1.75955 34.2612 8.21801 35.4848 17.899C36.6293 26.9411 29.3151 35.6845 19.863 36.0046C12.8936 36.2407 4.52068 31.0214 3.84758 23.5518Z" fill="white" />
        <path d="M20.5328 29.2506C19.6028 29.2506 18.1075 29.2151 17.0759 28.9872C14.7076 28.4658 11.6669 26.4528 10.6976 23.7532C9.86218 21.5007 9.76153 19.0387 10.4102 16.7246C10.9728 14.7552 12.0763 13.022 13.4604 11.9997C15.788 10.2801 17.6249 9.95256 19.0755 9.95256C19.2292 9.95164 19.3826 9.96581 19.5337 9.99486C20.2115 10.1313 20.6033 10.4207 20.7293 10.8724C20.7998 11.1634 20.7586 11.4704 20.6141 11.7322C20.5422 11.8544 20.4459 11.9603 20.3314 12.0432C20.2168 12.1262 20.0865 12.1843 19.9485 12.214C19.9146 12.2236 19.8604 12.2345 19.7858 12.2509C17.6588 12.7012 16.1947 12.7381 14.6764 14.5355C13.5038 15.9235 12.6158 18.4674 12.9656 20.7685C13.215 22.4062 13.8169 24.1477 15.2458 25.1576C16.413 25.9833 19.0497 27.0137 22.8374 25.7035C27.1754 24.2023 26.6332 20.1079 26.6332 17.9243C26.638 17.6449 26.7156 17.3718 26.8584 17.1322C27.0012 16.8927 27.204 16.6952 27.4466 16.5595C27.7177 16.423 28.26 16.5595 28.5311 16.8324C29.0557 17.3606 29.415 18.548 29.3445 19.8349C29.1398 23.5949 27.9888 28.1588 20.5328 29.2506Z" fill="#1E2532" />
        <path d="M22.5107 15.4486C21.9088 15.3435 21.62 14.7853 21.7474 14.0674C21.8423 13.5529 22.9838 10.9052 23.4447 10.1096C23.5179 9.98127 23.5925 9.85435 23.667 9.72606L23.8459 9.41761C23.9984 9.14456 24.1644 8.87946 24.3435 8.62331C24.5346 8.40222 24.7285 8.27529 24.9196 8.2903C25.9554 8.3681 25.8157 9.12282 25.6842 9.5964C25.5771 9.97991 24.8708 11.7801 24.8708 11.7801C26.5749 10.1723 29.133 7.55742 30.8885 5.8801L30.9089 5.86099L30.9251 5.83779C31.0054 5.72085 31.0633 5.58987 31.0959 5.45156C31.0959 5.45156 32.2238 2.73564 32.5017 1.93451C32.5885 1.68748 32.838 1.36949 33.0874 1.29033C33.1831 1.26329 33.2821 1.24951 33.3816 1.24939C33.4697 1.24956 33.5575 1.2601 33.6432 1.28078C33.7672 1.30694 33.8862 1.35302 33.9957 1.41726C34.443 1.69021 34.3576 2.24705 34.2668 2.55003C34.1638 2.89941 34.0418 3.25016 33.9252 3.58863L33.8818 3.71555C33.8126 3.91481 33.7462 4.10588 33.6825 4.29831L33.5144 4.80055L34.1299 4.61221C34.5881 4.47574 35.0192 4.33926 35.4503 4.20278H35.4719C35.7214 4.12772 36.0251 4.03491 36.3206 3.96804C36.4258 3.94228 36.5336 3.92899 36.6419 3.92846C36.7284 3.92816 36.8147 3.93685 36.8994 3.95439C37.0325 3.98073 37.1556 4.04408 37.2546 4.13727C37.3555 4.233 37.4281 4.35482 37.4647 4.48938C37.6003 4.95614 37.3183 5.56074 36.8005 5.77092C36.6188 5.84598 34.4159 6.61708 33.6825 6.86274C33.2758 6.99922 32.2428 7.91226 31.5623 8.60693C30.5903 9.59777 29.5288 10.5108 28.5053 11.3938L28.4118 11.4743C28.039 11.7964 27.6526 12.1294 27.2771 12.4624L26.4976 13.0084C26.4976 13.0084 28.2843 12.7354 28.5311 12.7354C29.217 12.7354 29.4353 13.4178 29.48 13.6908C29.6156 14.5096 28.5311 14.6461 27.8532 14.7826C27.2676 14.9013 23.3796 15.6028 22.5107 15.4486Z" fill="#1E2532" />
        <path d="M19.535 22.54C19.3984 22.5402 19.2621 22.5265 19.1283 22.499C18.0438 22.2684 17.2467 21.6979 16.8359 20.8463C16.3831 19.9086 16.4102 18.6531 16.9051 17.6445C17.4473 16.5335 18.605 15.6969 19.5892 15.6969C19.7063 15.6962 19.8231 15.7081 19.9376 15.7324C21.0411 15.9644 21.8979 16.5213 22.4184 17.3415C22.6487 17.7082 22.8044 18.1174 22.8763 18.5452C22.9482 18.973 22.935 19.411 22.8374 19.8336C22.5188 21.2216 20.9137 22.5345 19.5363 22.5345L19.535 22.54Z" fill="#1E2532" />
        <path d="M36.3938 25.17C35.3717 29.6833 31.7277 33.9046 28.0959 35.6911C23.9002 37.7628 16.9376 38.4807 11.3415 35.5341C9.1671 34.4025 7.28116 32.7813 5.83026 30.7965C4.37937 28.8118 3.40259 26.517 2.97585 24.0904C1.83711 17.6841 2.70473 12.1199 6.27007 7.91228C10.5715 2.83392 16.1093 1.46231 20.8188 1.71889C23.2332 1.85537 25.4429 2.37126 27.6608 3.62959C27.985 3.81876 28.2231 4.12786 28.3244 4.49109C28.4256 4.85432 28.3821 5.243 28.203 5.5744C28.1191 5.73808 28.0034 5.88312 27.8628 6.0009C27.7221 6.11868 27.5594 6.20679 27.3842 6.26C27.2091 6.31322 27.0251 6.33045 26.8432 6.31068C26.6614 6.2909 26.4853 6.23452 26.3254 6.14488C24.4642 5.094 22.8265 4.72278 20.8283 4.6136C16.9186 4.40069 12.4735 5.45703 8.80783 9.78476C5.78339 13.3537 4.58906 17.4917 5.58275 23.0805C6.34462 27.3727 8.79699 30.8857 12.3081 32.735C18.6525 36.0746 24.5089 34.1748 26.9301 32.9765C30.6893 31.1204 32.9694 26.7599 33.7733 24.1778C35.2252 19.5129 34.767 16.0123 32.4624 12.3274C32.0476 11.6641 32.2591 10.4098 32.9261 10.0209C33.593 9.63191 34.3766 9.91169 34.8036 10.5668C37.4106 14.5656 37.7495 19.1513 36.3938 25.17Z" fill="#1E2532" />
      </g>
      <defs>
        <clipPath id="clip0_15111_23063">
          <rect width="35" height="36.25" fill="white" transform="translate(2.5 1.25073)" />
        </clipPath>
      </defs>
    </svg>
  );

  const BenefitIcon3 = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <g clipPath="url(#clip0_15111_23068)">
        <path d="M4.98393 23.5528C4.21545 15.0362 8.00199 6.47959 15.7863 4.31077C24.929 1.76046 35.3976 8.21892 36.6211 17.8999C37.7657 26.9421 30.4515 35.6854 20.9994 36.0055C14.0299 36.2416 5.65703 31.0223 4.98393 23.5528Z" fill="white" />
        <path d="M2.59392 18.5286C2.73884 17.2174 3.00889 15.9224 3.40054 14.6605C4.75492 10.3348 8.03323 6.10122 11.674 4.32587C15.8775 2.27443 22.8701 1.52481 28.5138 4.37389C30.7063 5.46648 32.612 7.03904 34.083 8.96945C35.554 10.8999 36.5507 13.1362 36.9958 15.5048C38.1798 21.7605 37.3418 27.2039 33.7869 31.3375C29.4962 36.3274 23.9384 37.7026 19.2076 37.4825C16.7809 37.3691 13.4617 36.2127 11.2243 34.9922C10.8984 34.8085 10.6584 34.5076 10.5554 34.1535C10.4523 33.7993 10.4944 33.4198 10.6725 33.0955C10.7559 32.935 10.8714 32.7925 11.0121 32.6765C11.1528 32.5605 11.3158 32.4734 11.4916 32.4203C11.6673 32.3672 11.8522 32.3491 12.0352 32.3673C12.2182 32.3854 12.3956 32.4394 12.5569 32.526C14.4263 33.545 17.1637 34.5587 19.1721 34.6534C23.1045 34.8362 27.5655 33.7758 31.2226 29.5235C34.2393 26.0168 35.4125 21.9659 34.3797 16.5092C33.5853 12.3196 31.0986 8.90629 27.5573 7.11627C21.1601 3.89104 15.2943 5.78243 12.8594 6.97221C9.09329 8.81025 6.83011 13.0852 6.03847 15.6142C4.60778 20.1812 5.6692 25.662 8.74858 29.6595C9.22002 30.2704 8.88485 31.1868 8.21992 31.5709C7.55499 31.9551 6.76333 31.687 6.33004 31.0494C3.6785 27.1532 2.08432 24.4522 2.59392 18.5286Z" fill="#1E2532" />
        <path d="M26.233 18.8963C25.064 17.7532 23.621 17.5438 22.6413 17.5438C22.1549 17.5438 21.3728 17.5731 21.3483 17.5744L21.1398 13.5729C21.6678 13.672 22.1868 13.8125 22.6918 13.9931C23.2537 14.2085 23.7871 14.4893 24.2805 14.8294C24.7342 15.1215 25.0612 15.3336 25.3978 15.3336C25.6948 15.3336 26.1118 15.2162 26.402 14.6587C26.5791 14.3212 26.7345 13.781 26.0491 13.0007C25.3863 12.2706 24.5708 11.6887 23.6578 11.2947C22.8198 10.9212 21.4082 10.6851 20.8346 10.5931C20.8046 10.209 20.746 9.48468 20.7201 9.29528C20.6002 8.43095 20.2105 7.5066 19.4734 7.5066C19.1577 7.49245 18.8492 7.60127 18.6153 7.80924C18.3814 8.01722 18.2412 8.30742 18.2253 8.61635C18.2158 8.96849 18.2076 9.13522 18.2035 9.23659C18.1967 9.40332 18.1967 9.40865 18.2035 9.69543C18.2035 9.81014 18.2035 9.9622 18.213 10.2036C18.213 10.4811 18.2239 10.6038 18.2253 10.6478V10.6611C18.2062 10.6611 16.1011 11.2253 15.0029 12.159C13.4169 13.5142 12.9249 14.7267 13.3405 16.6581C13.7398 18.5135 15.5206 20.0514 17.3097 20.2715C17.435 20.2875 18.2866 20.3515 18.7485 20.3862L18.758 20.7276C18.7976 21.4039 18.8371 22.2522 18.8739 23.0725V23.0939C18.912 23.9075 18.9502 24.7465 18.9883 25.4121C18.5225 25.3198 18.0736 25.1588 17.6571 24.9346C17.2933 24.7066 16.971 24.4208 16.7033 24.0889C16.36 23.7021 16.0357 23.3366 15.4566 23.2659C15.3937 23.2591 15.3305 23.2555 15.2672 23.2553C14.9143 23.2553 14.421 23.3886 14.075 24.0169C13.9019 24.3303 13.955 24.7452 14.2235 25.2173C14.5178 25.7335 15.556 27.0754 16.7183 27.6983C18.0345 28.3999 18.8058 28.632 19.1818 28.7147L19.2036 28.9107C19.2418 29.1628 19.2813 29.4189 19.3194 29.679C19.3753 30.0499 19.4325 30.3246 19.4911 30.6127C19.5334 30.8235 19.5783 31.0396 19.6274 31.309C19.7187 31.8239 20.156 32.1493 20.806 32.18H20.8346C21.3278 32.18 21.8538 31.8745 21.8565 31.3103V30.8542C21.8565 30.4473 21.8483 29.8965 21.8565 29.4616C21.866 29.0908 21.8565 28.7507 21.8565 28.6493C21.8892 28.6493 24.7874 28.62 26.5328 26.3111C28.4063 23.8528 27.9771 20.6023 26.233 18.8963ZM21.629 25.6522C21.629 25.6522 21.629 21.1318 21.6113 20.4609C21.7557 20.4489 21.9492 20.4369 22.1713 20.4369C23.3471 20.4369 25.0081 20.3515 25.1689 22.5843C25.3801 25.4308 22.3825 25.6162 21.629 25.6522ZM18.4951 13.5142C18.5155 14.4706 18.5264 17.3117 18.5414 17.5744V17.6078C18.4869 17.6078 15.77 18.0493 15.6337 15.6484C15.6337 13.781 17.9746 13.5889 18.4951 13.5142Z" fill="#1E2532" />
      </g>
      <defs>
        <clipPath id="clip0_15111_23068">
          <rect width="35" height="35" fill="white" transform="translate(2.5 2.50073)" />
        </clipPath>
      </defs>
    </svg>
  );

  const BenefitIcon4 = () => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
      <g clipPath="url(#clip0_15111_23058)">
        <path d="M14.5304 5.53473C22.8782 3.64989 31.8396 6.26772 34.9793 13.686C38.6657 22.3976 33.5895 33.6087 24.1466 36.0987C15.3253 38.4255 5.72901 32.3399 4.21388 23.0286C3.09621 16.1624 7.20946 7.18702 14.5304 5.53473Z" fill="white" />
        <path d="M20.4108 15.5573C20.2668 14.5196 19.9213 12.9979 19.4238 12.1289C19.1689 11.6932 18.8139 11.3273 18.3894 11.0626C17.9649 10.798 17.4836 10.6426 16.9871 10.6099H16.9271C15.9735 10.5827 14.9451 11.4136 14.4863 11.9793C13.8571 12.7338 13.2778 13.5302 12.7525 14.3633C10.6185 17.8555 9.71688 22.0603 8.93931 25.8069C8.88729 26.0558 8.83794 26.82 9.22606 27.3436C9.34348 27.4998 9.49418 27.6268 9.66678 27.7149C9.83938 27.803 10.0294 27.8499 10.2224 27.8522C11.352 27.9093 11.6895 26.7044 11.9376 25.9578V25.9442C12.1416 25.3472 12.351 24.5095 12.5537 23.6977C12.7338 22.9728 12.9219 22.2235 13.0872 21.6959C13.8621 21.6184 14.6624 21.5381 15.4546 21.4239C16.0028 21.341 16.5363 21.2362 17.1018 21.1261L17.4179 21.0649C17.4179 21.3124 17.4179 21.5477 17.4019 21.7788C17.3459 22.8069 17.3659 25.1392 17.2952 26.2924C17.2472 27.073 17.642 27.6985 18.3022 27.8862C18.397 27.9133 18.4945 27.9297 18.5929 27.9352C18.8765 27.941 19.1557 27.863 19.3966 27.7105C19.6376 27.5579 19.83 27.3374 19.9507 27.0757C20.0694 26.8548 20.1531 26.6161 20.1987 26.3685C20.3188 25.5839 20.3454 23.7167 20.4321 22.86L20.4401 22.7825C20.7162 19.9892 20.7082 17.6937 20.4108 15.5573ZM17.7433 18.4865L13.7701 18.5899C14.3663 16.822 15.2186 15.0065 16.0521 14.0178C16.1398 13.9123 16.2529 13.8318 16.3803 13.7843C16.5077 13.7369 16.6451 13.724 16.7788 13.7471C16.9126 13.7701 17.0382 13.8283 17.1432 13.9158C17.2482 14.0033 17.3291 14.1172 17.3779 14.2463C17.682 15.0147 17.8233 16.9444 17.7487 18.4865H17.7433Z" fill="#1E2532" />
        <path d="M27.1902 24.9406C26.542 24.9406 26.0632 24.4552 25.9712 23.7167C25.9018 23.1728 25.8845 22.6138 25.8685 22.0753V22.0672C25.8685 21.8604 25.8551 21.6456 25.8458 21.4334C25.8458 21.4008 25.8458 21.2362 25.8458 21.1819V20.8718H25.579H25.1669C24.8628 20.8718 24.4387 20.8623 24.1506 20.8446C24.0172 20.8364 23.8945 20.8324 23.7665 20.8269C23.5824 20.8201 23.3904 20.812 23.201 20.797C22.5581 20.744 22.082 20.3319 21.9873 19.7458C21.9237 19.4353 21.9794 19.1119 22.143 18.8421C22.3065 18.5723 22.5654 18.3769 22.8662 18.2961C23.2998 18.162 23.7475 18.0807 24.1999 18.0541L24.436 18.0323C24.644 18.0133 24.8528 18.0056 25.0615 18.0092C25.2243 18.0092 25.3923 18.016 25.555 18.0214L25.9098 18.035V17.7508C25.9098 17.4503 25.9098 17.2177 25.9191 16.977V16.8097C25.9271 16.4942 25.9351 16.1692 25.9698 15.8469C26.0472 15.1099 26.5527 14.5509 27.1702 14.5197H27.2462C27.8611 14.5197 28.3692 15.016 28.4799 15.7096C28.5599 16.2209 28.6133 16.7295 28.6586 17.2694C28.668 17.3741 28.7107 17.8229 28.7107 17.8229L28.9467 17.8338H29.0147L29.6363 17.8746C30.1978 17.9085 30.7726 17.9439 31.3355 18.0105C31.6525 18.0405 31.9483 18.186 32.1688 18.4202C32.3892 18.6545 32.5195 18.9619 32.5358 19.2861C32.5649 19.621 32.4675 19.9546 32.2635 20.2187C32.0595 20.4829 31.7643 20.6576 31.4382 20.7072C30.8714 20.8094 30.2998 20.8811 29.7256 20.9221L29.4215 20.9493C29.3062 20.9594 29.1905 20.9635 29.0748 20.9615H28.9267L28.6693 20.9534L28.612 21.6891C28.5599 22.3609 28.5106 22.9946 28.4452 23.6324C28.3639 24.4171 27.9051 24.9175 27.2449 24.942L27.1902 24.9406Z" fill="#1E2532" />
        <path d="M19.2094 2.50619C20.5295 2.47562 21.8495 2.57214 23.1519 2.79449C27.6119 3.56284 32.2213 6.25002 34.4473 9.61716C37.0134 13.5065 38.6393 20.3278 36.5333 26.2897C35.7281 28.6037 34.4104 30.6972 32.6827 32.4076C30.955 34.1181 28.8638 35.3993 26.5716 36.1517C20.5204 38.1508 15.0174 38.0393 10.468 35.0638C4.97702 31.4804 2.90839 26.1618 2.52694 21.4457C2.32688 19.0291 3.23515 14.8827 4.16077 12.507C4.30184 12.1601 4.56984 11.8829 4.90796 11.7342C5.24607 11.5854 5.62772 11.5768 5.97199 11.7101C6.14128 11.7719 6.2967 11.8677 6.42907 11.9918C6.56144 12.1159 6.66808 12.2658 6.74268 12.4326C6.81727 12.5994 6.85832 12.7798 6.8634 12.9631C6.86848 13.1464 6.83748 13.3288 6.77223 13.4997C5.99866 15.4852 5.16241 19.0373 5.32379 21.0377C5.64122 24.9529 7.25638 29.2284 11.9365 32.2855C15.7963 34.8081 19.9616 35.435 25.2405 33.6916C29.2938 32.3521 32.368 29.4406 33.6898 25.7008C36.0758 18.9434 33.4537 13.3855 31.9692 11.1348C29.6685 7.65073 25.1485 5.97532 22.5397 5.52519C20.1682 5.12024 17.7363 5.29586 15.4445 6.03759C13.1527 6.77932 11.0666 8.06589 9.35835 9.79123C8.81152 10.3352 7.86056 10.1298 7.39642 9.51925C6.93228 8.90865 7.09633 8.0927 7.67251 7.57457C11.1962 4.44678 13.2635 2.78497 19.2094 2.50619Z" fill="#1E2532" />
      </g>
      <defs>
        <clipPath id="clip0_15111_23058">
          <rect width="35" height="35" fill="white" transform="translate(2.5 2.50073)" />
        </clipPath>
      </defs>
    </svg>
  );

  const benefits = [
    {
      icon: <BenefitIcon1 />,
      title: "A draft in 10 mins",
      desc: "The AI builder is 10x faster than doing it on your own.",
    },
    {
      icon: <BenefitIcon2 />,
      title: "Zero mistakes",
      desc: "Don't stress over typos; you'll sound great!",
    },
    {
      icon: <BenefitIcon3 />,
      title: "ATS templates",
      desc: "Your resume will be 100% compliant. Recruiters will see you.",
    },
    {
      icon: <BenefitIcon4 />,
      title: "Get paid 7% more",
      desc: "We can help you negotiate a higher starting salary.",
    },
  ];

  const features = [
    {
      bg: "bg-indigo-50 border-indigo-100",
      badge: true,
      testId: "feature-step-guidance",
      title: "Step-by-step guidance",
      desc: "No need to think much. We guide you through every step of the process. We show you what to add and where to add it. It's clear and simple.",
      link: { label: "Create my resume →", href: "#" },
    },
    {
      bg: "bg-indigo-50 border-indigo-100",
      badge: true,
      testId: "feature-ai-writes",
      title: "AI writes for you",
      desc: "Speak into the mic and the AI fixes mistakes. Stuck? Click to add phrases that sound professional.",
    },
    {
      bg: "bg-indigo-50 border-indigo-100",
      badge: true,
      testId: "feature-cover-letters",
      title: "Instant cover letters",
      desc: "Just paste a job link. We create a matching cover letter using your resume. You're done in 2 mins! Purpose built to impress recruiters.",
    },
    {
      bg: "bg-sky-50 border-sky-100",
      badge: false,
      testId: "feature-job-link",
      title: "Paste any job link",
      desc: "Simple and effective. We have the formula that works for recruiters. Just paste the job description and we pre-build your resume to match.",
      link: { label: "Tailor my resume →", href: "#" },
    },
    {
      bg: "bg-sky-50 border-sky-100",
      badge: false,
      testId: "feature-recruiter-match",
      title: "Recruiter Match",
      desc: "Recruiters come to us with roles they can't fill. We match your resume with up to 50 recruiters a week. When there's a match, they'll contact you via email.",
      link: { label: "Start distributing →", href: "#" },
    },
    {
      bg: "bg-emerald-50 border-emerald-100",
      badge: false,
      testId: "feature-advice",
      title: "Need some advice?",
      desc: "98% of our coaching clients receive a job offer within 12 weeks.",
    },
  ];

  const steps = [
    {
      title: "Enhance your resume with our expert content",
      desc: "Choose from thousands of top-rated phrases for your resume. Click to insert them directly. Use the star rating system to indicate your skill level.",
    },
    {
      title: "Resume and cover letter in one place",
      desc: "Create a brand for yourself with a matching resume and cover letter. Get expert suggestions and professional cover letter templates to complement your resume.",
    },
    {
      title: "Professionally designed templates",
      desc: "Our expert-designed templates are ready to pass applicant tracking systems (ATS) used by companies to scan resumes.",
    },
    {
      title: "Expert tips & guidance",
      desc: "Detailed resume-building tips and advice every step of the way. Resume pro or beginner — we've got you covered.",
    },
    {
      title: "Apply for jobs with confidence",
      desc: "From a quick polish to a full makeover, our resume tools are here to help you shine.",
    },
  ];

  const results = [
    {
      icon: <ResultIconApproved />,
      title: "Recruiter-Approved Resume",
      desc: "We work with recruiters to design resume templates that format automatically.",
    },
    {
      icon: <ResultIconTime />,
      title: "Finish Your Resume in 15 Minutes",
      desc: "We help you tackle your work experience by reminding you what you did at your job.",
    },
    {
      icon: <ResultIconResume />,
      title: "Land an Interview",
      desc: "We suggest the skills you should add. It helped over a million people get interviews.",
    },
  ];

  return (
    <main className="min-h-screen bg-[url('https://images.unsplash.com/photo-1707209857286-62b9be358128?q=80&w=1518&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-no-repeat ">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/30 backdrop-blur-xl border border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)]">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-0 px-6">
          <svg
            data-testid="brand-logo"
            onClick={() => navigate("/")}
            className="h-18 w-auto cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 100"
          >
            <defs>
              <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
              <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            {/* Main Grid Background Elements */}
            <polygon points="50,5 90,28 90,72 50,95 10,72 10,28" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.1" />
            {/* Left Column of H (Neural Path) */}
            <rect x="26" y="24" width="8" height="52" rx="4" fill="url(#primaryGrad)" />
            <circle cx="30" cy="34" r="2" fill="#ffffff" />
            <circle cx="30" cy="50" r="2" fill="#ffffff" opacity="0.6" />
            <circle cx="30" cy="66" r="2" fill="#ffffff" />
            {/* Left Nodes */}
            <circle cx="16" cy="42" r="3" fill="#06b6d4" />
            <circle cx="16" cy="58" r="3" fill="#3b82f6" />
            {/* Center Bridge */}
            <path d="M 34,50 L 52,50" stroke="url(#primaryGrad)" strokeWidth="8" strokeLinecap="round" />
            {/* Right Column of H / Ready Checkmark */}
            <path d="M 46,45 L 56,69 L 82,21" fill="none" stroke="url(#accentGrad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 46,45 L 56,69 L 82,21" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
            {/* Floating AI Details */}
            <circle cx="85" cy="48" r="2.5" fill="#06b6d4" opacity="0.8" />
            {/* Brand Typography */}
            <g transform="translate(104, 0)">
              <text x="0" y="58" textAnchor="start" fontFamily="system-ui, -apple-system, sans-serif" fontSize="28" fontWeight="800" fill="#0441b3">
                Hire<tspan fill="url(#textGrad)" fontWeight="900">Ready</tspan>
              </text>
            </g>
          </svg>

          <div className="flex gap-3">
            <button
              data-testid="nav-login-btn"
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-[50px] border border-gray-300 text-sm text-[#0441b3] font-medium hover:bg-gray-50 transition cursor-pointer"
            >
              Login
            </button>
            <button
              data-testid="nav-register-btn"
              onClick={() => navigate("/register")}
              className="px-5 py-2 rounded-[50px] bg-[#0441b3] text-white text-sm font-medium hover:bg-[#032f85] transition cursor-pointer"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero - two-column, constrained image */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 ">
        <div className="flex flex-col md:flex-row md:items-center gap-12">

          {/* Left: text */}
          <div className="flex-1 min-w-0" data-testid="hero-typing-content">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
              This resume builder<br />gets you{" "}
              <span className="text-[#0441b3] whitespace-nowrap">
                {typed}
                <span className="inline-block w-[3px] h-[0.85em] align-middle bg-[#0441b3] ml-1 animate-pulse" />
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-500">
              Only 2% of resumes win. Yours will be one of them.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                data-testid="hero-create-resume-btn"
                onClick={() => navigate("/resume-builder")}
                className="px-7 py-3.5 rounded-[50px] bg-[#0441b3] text-white text-base font-semibold hover:bg-[#032f85] transition cursor-pointer shadow-sm"
              >
                Create my resume
              </button>
              <button
                data-testid="hero-upload-resume-btn"
                onClick={() => navigate("/interview-analysis")}
                className="px-7 py-3.5 rounded-[50px] bg-[#f0f9ff] text-[#0441b3] text-base font-semibold hover:bg-[#e0f2fe] transition cursor-pointer"
              >
                Analyze my resume
              </button>
            </div>

            <div className="mt-8 flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg width="20" height="20" viewBox="0 0 21 20" fill="none">
                  <path
                    d="M10.5 1C15.47 1 19.5 5.03 19.5 10C19.5 14.97 15.47 19 10.5 19C5.53 19 1.5 14.97 1.5 10C1.5 5.03 5.53 1 10.5 1ZM9.5 11.09L7.21 8.79L5.79 10.21L8.44 12.85C9.03 13.44 9.97 13.44 10.56 12.85L15.21 8.21L13.79 6.79L9.5 11.09Z"
                    fill="#25B869"
                  />
                </svg>
                <span className="font-semibold">39%</span>
                <span className="text-gray-500">more likely to land the job</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#00B67A">
                  <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.26L12 19.771l-7.417 3.76L6 15.27 0 9.423l8.332-1.268L12 .587z" />
                </svg>
                <span className="font-semibold">Trustpilot</span>
                <span className="text-gray-500">4.4 out of 5 · 37,389 reviews</span>
              </div>
            </div>
          </div>

          {/* Right: image — constrained so it never bleeds */}
          <div className="flex-1 min-w-0 flex justify-center md:justify-end overflow-hidden ">
            <img
              data-testid="hero-image"
              alt="Resume preview"
              loading="eager"
              className="w-full max-w-[480px] object-contain drop-shadow-xl rounded-2xl"
              src="https://www.resume.io/assets/landing/home/hero/typing-hero-e5eba566.png"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map((item, i) => (
            <div
              key={i}
              data-testid={`benefit-card-${i}`}
              className="rounded-2xl bg-white/30 backdrop-blur-xl border-white/40 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] border p-6 hover:shadow-md transition"
            >
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-6">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-center text-4xl md:text-5xl font-bold text-gray-900 mb-12">
          Way beyond a resume builder...
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.testId}
              data-testid={f.testId}
              className={`rounded-[50px] p-8 border ${f.bg}`}
            >
              {f.badge && (
                <span className="inline-block text-xs font-semibold text-indigo-600 bg-white px-3 py-1 rounded-full mb-3 border border-indigo-100">
                  ✦ AI-powered
                </span>
              )}
              <h3 className="text-xl font-bold text-gray-900">{f.title}</h3>
              <p className="mt-2 text-sm text-gray-600 leading-6">{f.desc}</p>
              {f.link && (
                <a
                  href={f.link.href}
                  className="inline-flex items-center gap-1 mt-4 text-sm text-blue-600 font-semibold hover:underline"
                >
                  {f.link.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Step Flow */}
      <section className="max-w-7xl mx-auto px-6 py-16">
  <div className="grid md:grid-cols-2 gap-16 items-center">
    <RotatingResumeStack />

    <ol className="space-y-7">
      {steps.map((s, idx) => (
        <li
          key={idx}
          data-testid={`step-flow-${idx + 1}`}
          className="flex gap-4"
        >
          <span className="shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white text-sm font-bold flex items-center justify-center">
            {idx + 1}
          </span>
          <div>
            <h4 className="text-base font-bold text-gray-900">{s.title}</h4>
            <p className="mt-1 text-sm text-gray-600 leading-6">{s.desc}</p>
          </div>
        </li>
      ))}
    </ol>
  </div>
</section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Build a Resume That Gets You Hired
          </h2>
          <button
            data-testid="final-create-resume-btn"
            onClick={() => navigate("/resume-builder")}
            className="md:ml-auto px-8 py-4 rounded-[50px] bg-[#0441b3] text-white text-base font-bold hover:bg-[#032f85] transition cursor-pointer shadow-md"
          >
            Create Resume
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-10 ">
          {results.map((c, i) => (
            <div key={i} data-testid={`result-card-${i}`}>
              <div className="mb-4">{c.icon}</div>
              <h4 className="text-lg font-bold text-gray-900">{c.title}</h4>
              <p className="mt-2 text-sm text-gray-600 leading-6">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-8 bg-white/40 backdrop-blur-xl border-t border-white/40">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
            {/* Brand column */}
            <div className="col-span-2">
              <svg
                className="h-12 w-auto cursor-pointer"
                onClick={() => navigate("/")}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 320 100"
              >
                <defs>
                  <linearGradient id="footerPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                  <linearGradient id="footerAccentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                  <linearGradient id="footerTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
                <rect x="26" y="24" width="8" height="52" rx="4" fill="url(#footerPrimaryGrad)" />
                <circle cx="30" cy="34" r="2" fill="#ffffff" />
                <circle cx="30" cy="50" r="2" fill="#ffffff" opacity="0.6" />
                <circle cx="30" cy="66" r="2" fill="#ffffff" />
                <circle cx="16" cy="42" r="3" fill="#06b6d4" />
                <circle cx="16" cy="58" r="3" fill="#3b82f6" />
                <path d="M 34,50 L 52,50" stroke="url(#footerPrimaryGrad)" strokeWidth="8" strokeLinecap="round" />
                <path d="M 46,45 L 56,69 L 82,21" fill="none" stroke="url(#footerAccentGrad)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M 46,45 L 56,69 L 82,21" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
                <circle cx="85" cy="48" r="2.5" fill="#06b6d4" opacity="0.8" />
                <g transform="translate(104, 0)">
                  <text x="0" y="58" textAnchor="start" fontFamily="system-ui, -apple-system, sans-serif" fontSize="28" fontWeight="800" fill="#0441b3">
                    Hire<tspan fill="url(#footerTextGrad)" fontWeight="900">Ready</tspan>
                  </text>
                </g>
              </svg>

              <p className="mt-4 text-sm text-gray-500 leading-6 max-w-xs">
                AI-powered resumes and cover letters that help you get noticed, get interviews, and get hired.
              </p>

              <div className="mt-6 flex gap-3">
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0441b3] hover:border-[#0441b3] transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.34V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.11 20.45H3.56V9h3.55v11.45z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="X (Twitter)"
                  className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0441b3] hover:border-[#0441b3] transition"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.9 2H22l-7.6 8.7L23 22h-6.9l-5.4-6.6L4.5 22H1.3l8.1-9.3L1 2h7.1l4.9 6.1L18.9 2zm-1.2 18h1.7L7.4 4H5.6l12.1 16z" />
                  </svg>
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0441b3] hover:border-[#0441b3] transition"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.2c3.2 0 3.6 0 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.25.07 1.63.07 4.81 0 3.19-.01 3.56-.07 4.81-.15 3.23-1.66 4.77-4.92 4.92-1.25.06-1.62.07-4.85.07-3.2 0-3.58-.01-4.81-.07-3.26-.15-4.77-1.7-4.92-4.92-.06-1.25-.07-1.62-.07-4.81 0-3.18.02-3.56.07-4.81.15-3.23 1.67-4.77 4.92-4.92C8.42 2.21 8.8 2.2 12 2.2zm0 5.45a4.35 4.35 0 1 0 0 8.7 4.35 4.35 0 0 0 0-8.7zm0 7.17a2.82 2.82 0 1 1 0-5.64 2.82 2.82 0 0 1 0 5.64zm5.54-7.34a1.02 1.02 0 1 1-2.04 0 1.02 1.02 0 0 1 2.04 0z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Link columns */}
            <div>
              <h4 className="text-sm font-bold text-gray-900">Product</h4>
              <ul className="mt-4 space-y-3 text-sm text-gray-500">
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/resume-builder"); }} className="hover:text-[#0441b3] transition">Resume Builder</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigate("/interview-analysis"); }} className="hover:text-[#0441b3] transition">Resume Analysis</a></li>
                <li><a href="#" className="hover:text-[#0441b3] transition">Cover Letters</a></li>
                <li><a href="#" className="hover:text-[#0441b3] transition">Templates</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900">Company</h4>
              <ul className="mt-4 space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#0441b3] transition">About Us</a></li>
                <li><a href="#" className="hover:text-[#0441b3] transition">Careers</a></li>
                <li><a href="#" className="hover:text-[#0441b3] transition">Blog</a></li>
                <li><a href="#" className="hover:text-[#0441b3] transition">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold text-gray-900">Legal</h4>
              <ul className="mt-4 space-y-3 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#0441b3] transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#0441b3] transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#0441b3] transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} HireReady AI · All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#00B67A">
                <path d="M12 .587l3.668 7.568L24 9.423l-6 5.847 1.417 8.26L12 19.771l-7.417 3.76L6 15.27 0 9.423l8.332-1.268L12 .587z" />
              </svg>
              <span>Trustpilot · 4.4 / 5 · 37,389 reviews</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Home;