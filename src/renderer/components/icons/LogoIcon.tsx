import type { FC } from 'react';

import { APPLICATION } from '../../../shared/constants';

interface ILogoIcon {
  width?: number;
  height?: number;
}

export const LogoIcon: FC<ILogoIcon> = ({
  width = 48,
  height = 48,
}: ILogoIcon) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width={width}
    height={height}
    viewBox="0 0 48 48"
    role="img"
    aria-label={`${APPLICATION.NAME} Logo`}
  >
    <defs>
      <linearGradient
        id="b"
        x1="19.736"
        x2="12.939"
        y1="-1375.987"
        y2="-1345.704"
        gradientTransform="matrix(1 0 0 -1 0 -1338)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#fff" />
        <stop offset=".17" stopColor="#fff" stopOpacity=".91" />
        <stop offset=".5" stopColor="#fff" stopOpacity=".74" />
        <stop offset=".76" stopColor="#fff" stopOpacity=".64" />
        <stop offset=".92" stopColor="#fff" stopOpacity=".6" />
      </linearGradient>
      <linearGradient
        id="a"
        x1="16.039"
        x2="30.624"
        y1="-1360.508"
        y2="-1366.359"
        gradientTransform="matrix(1 0 0 -1 0 -1338)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#fff" />
        <stop offset=".18" stopColor="#fff" stopOpacity=".91" />
        <stop offset=".55" stopColor="#fff" stopOpacity=".74" />
        <stop offset=".83" stopColor="#fff" stopOpacity=".64" />
        <stop offset="1" stopColor="#fff" stopOpacity=".6" />
      </linearGradient>
      <linearGradient
        xlinkHref="#a"
        id="c"
        x1="34.085"
        x2="31.243"
        y1="-1343.389"
        y2="-1372.878"
      />
      <linearGradient
        id="d"
        x1="28.228"
        x2="28.228"
        y1="-1380.805"
        y2="-1346.203"
        gradientTransform="matrix(1 0 0 -1 0 -1338)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".1" stopColor="#fff" />
        <stop offset=".27" stopColor="#fff" stopOpacity=".91" />
        <stop offset=".59" stopColor="#fff" stopOpacity=".74" />
        <stop offset=".85" stopColor="#fff" stopOpacity=".64" />
        <stop offset="1" stopColor="#fff" stopOpacity=".6" />
      </linearGradient>
      <linearGradient
        id="e"
        x1="18.853"
        x2="20.915"
        y1="-1345.646"
        y2="-1378.103"
        gradientTransform="matrix(1 0 0 -1 0 -1338)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset=".03" stopColor="#fff" />
        <stop offset=".1" stopColor="#fff" stopOpacity=".9" />
        <stop offset=".29" stopColor="#fff" stopOpacity=".68" />
        <stop offset=".38" stopColor="#fff" stopOpacity=".6" />
        <stop offset=".59" stopColor="#fff" stopOpacity=".6" />
        <stop offset=".65" stopColor="#fff" stopOpacity=".65" />
        <stop offset=".76" stopColor="#fff" stopOpacity=".77" />
        <stop offset=".91" stopColor="#fff" stopOpacity=".96" />
        <stop offset=".94" stopColor="#fff" />
      </linearGradient>
    </defs>
    <g fill="none">
      <path d="M.095 0h48v48h-48z" />
      <path d="M.095 0h48v48h-48z" />
    </g>
    <path
      fill="url(#b)"
      d="M24.007 9.471V6.588c-9.988 0-18.109 8.121-18.109 18.108 0 1.031.098 2.034.251 3.023 0 .042 0 .098.014.139 1.504 8.483 8.915 14.947 17.83 14.947v-2.883c-7.55 0-13.832-5.516-15.016-12.732a2.681 2.681 0 0 1 .585-2.048c.752-.919 2.103-1.407 3.9-1.407.947 0 1.839.125 2.772.376v-2.953a12.999 12.999 0 0 0-2.772-.293c-1.964 0-3.399.446-4.43 1.045 1.323-7.076 7.536-12.439 14.974-12.439Z"
    />
    <path
      fill="url(#a)"
      d="M26.946 25.42c-.696-.306-1.477-.669-2.368-1.059-.515-.223-1.017-.446-1.49-.655-2.702-1.198-4.778-2.117-6.853-2.549v2.953c1.574.418 3.287 1.17 5.683 2.229.474.209.975.432 1.504.655.878.39 1.658.738 2.34 1.045 2.521 1.128 4.04 1.811 5.962 2.201l.557-2.828c-1.602-.32-2.925-.905-5.335-1.992Z"
    />
    <path
      fill="url(#c)"
      d="M42.102 24.376v-.71c-.557-9.514-8.455-17.078-18.095-17.078v2.883c8.288 0 15.044 6.644 15.211 14.891a3.002 3.002 0 0 1-.78 1.978c-.78.85-2.131 1.295-3.914 1.295-.766 0-1.504-.07-2.257-.223l-.557 2.828a14.61 14.61 0 0 0 2.814.279c1.588 0 2.842-.279 3.803-.696-2.103 5.878-7.745 10.099-14.334 10.099v2.883c9.988 0 18.109-8.121 18.109-18.109v-.32Z"
    />
    <path
      fill="url(#d)"
      d="M24.007 42.804v-2.883c4.137 0 6.603-4.221 6.603-11.283s-2.507-12.983-7.647-18.457l2.103-1.978c5.669 6.032 8.427 12.718 8.427 20.435 0 8.734-3.636 14.167-9.486 14.167Z"
    />
    <path
      fill="url(#e)"
      d="M24.007 42.805c-6.227 0-9.793-5.07-9.793-13.916 0-10.322 4.513-16.089 8.734-20.672l2.117 1.95c-4.917 5.349-7.968 10.336-7.968 18.722 0 9.124 3.761 11.032 6.909 11.032v2.883Z"
    />
    <path
      fill="#fff"
      d="M16.29 26.201a3.37 3.37 0 1 0 0-6.741 3.37 3.37 0 0 0 0 6.741ZM31.877 32.01a3.37 3.37 0 1 0 0-6.741 3.37 3.37 0 0 0 0 6.741ZM24.007 11.937a3.37 3.37 0 1 0 0-6.741 3.37 3.37 0 0 0 0 6.741Z"
    />
  </svg>
);
