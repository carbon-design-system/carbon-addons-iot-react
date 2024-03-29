/* tslint:disable */
import { Component, Input } from '@angular/core';

@Component({
  selector: 'empty-state-error-icon',
  template: `
    <svg
      [ngClass]="iconClass"
      width="80px"
      height="80px"
      viewBox="0 0 80 80"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <title>Error(80px)</title>
      <defs>
        <linearGradient
          x1="40.8299248%"
          y1="147.026357%"
          x2="53.751555%"
          y2="5.47627254%"
          id="linearGradient-1"
        >
          <stop stop-color="#767676" offset="0%"></stop>
          <stop stop-color="#FFFFFF" offset="100%"></stop>
        </linearGradient>
        <linearGradient
          x1="44.3732105%"
          y1="97.6847194%"
          x2="66.6032669%"
          y2="-9.50285634%"
          id="linearGradient-2"
        >
          <stop stop-color="#FFFFFF" offset="0%"></stop>
          <stop stop-color="#FFFFFF" offset="100%"></stop>
        </linearGradient>
        <linearGradient
          x1="45.7327791%"
          y1="91.0529378%"
          x2="67.9783592%"
          y2="-16.134638%"
          id="linearGradient-3"
        >
          <stop stop-color="#939393" offset="0%"></stop>
          <stop stop-color="#DCDCDC" offset="100%"></stop>
        </linearGradient>
        <linearGradient
          x1="-52.3537658%"
          y1="92.6800517%"
          x2="72.3258762%"
          y2="51.3310333%"
          id="linearGradient-4"
        >
          <stop stop-color="#000000" stop-opacity="0.18" offset="0%"></stop>
          <stop stop-color="#000000" stop-opacity="0.05" offset="100%"></stop>
        </linearGradient>
        <linearGradient
          x1="55.0343903%"
          y1="-24.4810882%"
          x2="40.155461%"
          y2="198.063317%"
          id="linearGradient-5"
        >
          <stop stop-color="#000000" stop-opacity="0.2" offset="0%"></stop>
          <stop stop-color="#000000" stop-opacity="0.5" offset="100%"></stop>
        </linearGradient>
        <linearGradient
          x1="39.2300652%"
          y1="121.252236%"
          x2="48.6276286%"
          y2="57.2450805%"
          id="linearGradient-6"
        >
          <stop stop-color="#BEBEBE" offset="0%"></stop>
          <stop stop-color="#D8D8D8" offset="100%"></stop>
        </linearGradient>
        <linearGradient
          x1="6.81008433%"
          y1="148.311026%"
          x2="49.0615052%"
          y2="26.5774379%"
          id="linearGradient-7"
        >
          <stop stop-color="#CCCCCC" offset="0%"></stop>
          <stop stop-color="#FFFFFF" offset="100%"></stop>
        </linearGradient>
        <linearGradient
          x1="50.2634412%"
          y1="63.0489732%"
          x2="50.2634412%"
          y2="-84.1454439%"
          id="linearGradient-8"
        >
          <stop stop-color="#CCCCCC" offset="2%"></stop>
          <stop stop-color="#EEEEEE" offset="100%"></stop>
        </linearGradient>
        <linearGradient
          x1="9731.50677%"
          y1="17393.6497%"
          x2="9762.56869%"
          y2="17462.1199%"
          id="linearGradient-9"
        >
          <stop stop-color="#CCCCCC" offset="0%"></stop>
          <stop stop-color="#FFFFFF" offset="100%"></stop>
        </linearGradient>
        <linearGradient
          x1="39.3794662%"
          y1="-82.7885257%"
          x2="47.4522708%"
          y2="18.1454303%"
          id="linearGradient-10"
        >
          <stop stop-color="#828282" offset="0%"></stop>
          <stop stop-color="#C9C9C9" offset="100%"></stop>
        </linearGradient>
      </defs>
      <g id="Error(80px)" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Group" transform="translate(14.000000, 0.000000)" fill-rule="nonzero">
          <g id="Artboard-3-copy">
            <g id="Layer0_9_MEMBER_0_MEMBER_0_FILL" fill="url(#linearGradient-1)">
              <path
                d="M27.3333333,0.84 C26.9759845,0.64947822 26.5835529,0.533790309 26.18,0.5 C25.1134957,0.459034685 24.0605819,0.750216605 23.1666667,1.33333333 C22.020026,2.02929398 21.0138063,2.93376112 20.2,4 C19.2893207,5.14077795 18.5483253,6.40720641 18,7.76 L0.933333333,51.64 C0.433260663,52.8905595 0.160099682,54.220244 0.126666667,55.5666667 C0.0779846433,56.6168182 0.357600913,57.6560586 0.926666667,58.54 C1.13328886,58.8477078 1.3928673,59.116315 1.69333333,59.3333333 L1.82666667,59.4133333 C1.89710094,59.4584333 1.97061505,59.4985319 2.04666667,59.5333333 L7.66,62.7733333 L7.66,62.7733333 C7.28840801,62.5491836 6.96813705,62.2493554 6.72,61.8933333 C6.1874086,61.0647494 5.90928354,60.0982648 5.92,59.1133333 L5.92,58.92 C5.95555647,57.5731718 6.23097792,56.2434731 6.73333333,54.9933333 L23.7933333,11.0933333 C24.3409107,9.72029028 25.0841569,8.4336435 26,7.27333333 C26.819716,6.22896542 27.825521,5.34521316 28.9666667,4.66666667 C29.2972503,4.46322927 29.6426694,4.28494848 30,4.13333333 C30.6233062,3.89035512 31.2925522,3.78791951 31.96,3.83333333 C32.327805,3.86375386 32.6869968,3.96089378 33.02,4.12 L27.3333333,0.826666667 L27.3333333,0.84 Z"
                id="Path"
              ></path>
            </g>
            <g
              id="Layer0_9_MEMBER_0_MEMBER_1_FILL"
              transform="translate(5.333333, 3.333333)"
              fill="url(#linearGradient-2)"
            >
              <path
                d="M28.6666667,1.58666667 C28.4430101,1.26927378 28.1627742,0.995817811 27.84,0.78 C27.7768554,0.732457577 27.7099709,0.6900974 27.64,0.653333333 L27.5266667,0.593333333 C27.1925363,0.437289195 26.8339019,0.340300012 26.4666667,0.306666667 C25.7992188,0.261252844 25.1299729,0.363688449 24.5066667,0.606666667 C24.150126,0.749678247 23.804727,0.919035173 23.4733333,1.11333333 C22.3274925,1.79912454 21.3192289,2.69209342 20.5,3.74666667 C19.5865022,4.90738924 18.8455131,6.19401571 18.3,7.56666667 L1.20666667,51.4466667 C0.703119856,52.6961812 0.429828278,54.0265014 0.4,55.3733333 L0.4,55.5666667 C0.384136163,56.5513405 0.660183434,57.5186658 1.19333333,58.3466667 C1.43960235,58.7043013 1.76025539,59.0044871 2.13333333,59.2266667 C2.52206485,59.439155 2.95159132,59.5664221 3.39333333,59.6 C4.43795045,59.653414 5.47306489,59.378316 6.35333333,58.8133333 L40.3533333,39.14 C41.5111702,38.4437811 42.5304837,37.5397337 43.36,36.4733333 C44.2728511,35.3265763 45.0057004,34.047462 45.5333333,32.68 C46.032604,31.4439248 46.2992988,30.1262717 46.32,28.7933333 C46.3739641,27.7357899 46.1041912,26.6869315 45.5466667,25.7866667 L28.6666667,1.58666667 Z"
                id="Path"
              ></path>
            </g>
            <g
              id="Layer0_9_MEMBER_0_MEMBER_2_FILL"
              transform="translate(5.333333, 3.333333)"
              fill="url(#linearGradient-3)"
            >
              <path
                d="M28.8266667,1.78 C28.6030101,1.46260712 28.3227742,1.18915114 28,0.973333333 C27.9358929,0.927199071 27.8691093,0.884902771 27.8,0.846666667 L27.6866667,0.786666667 C27.3536635,0.627560451 26.9944716,0.530420523 26.6266667,0.5 C25.9592188,0.454586177 25.2899729,0.557021783 24.6666667,0.8 C24.310126,0.94301158 23.964727,1.11236851 23.6333333,1.30666667 C22.4898823,1.99312579 21.4839231,2.88605588 20.6666667,3.94 C19.7531688,5.10072258 19.0121798,6.38734905 18.4666667,7.76 L1.4,51.64 C0.897644583,52.8901398 0.622223132,54.2198385 0.586368249,55.5666667 L0.586368249,55.76 C0.575950204,56.7449315 0.854075262,57.7114161 1.38666667,58.54 C1.88142602,59.2812215 2.69676288,59.7457164 3.58666667,59.7933333 C4.63128378,59.8467473 5.66639823,59.5716494 6.54666667,59.0066667 L40.5733333,39.3333333 C41.7311702,38.6371145 42.7504837,37.733067 43.58,36.6666667 C44.4928511,35.5199096 45.2257004,34.2407954 45.7533333,32.8733333 C46.252604,31.6372581 46.5192988,30.319605 46.54,28.9866667 C46.5898684,27.9358468 46.3202517,26.8945685 45.7666667,26 L28.8266667,1.78 Z"
                id="Path"
              ></path>
            </g>
            <g
              id="Layer0_9_MEMBER_0_MEMBER_3_FILL"
              transform="translate(5.333333, 53.333333)"
              fill="url(#linearGradient-4)"
            >
              <path
                d="M2.26,18.6066667 C-0.0244444444,19.94 -0.0244444444,21.2733333 2.26,22.6066667 L6.77333333,25.2133333 C8.86991302,26.5402461 11.5434203,26.5402461 13.64,25.2133333 L43.5266667,7.89333333 C45.82,6.56 45.82,5.22666667 43.5266667,3.89333333 L39.0133333,1.33333333 C36.9142158,0.00686654814 34.2391176,0.00686654814 32.14,1.33333333 L2.26,18.6066667 Z"
                id="Path"
              ></path>
            </g>
            <g
              id="Layer0_9_MEMBER_1_MEMBER_0_FILL"
              transform="translate(25.333333, 17.333333)"
              fill="url(#linearGradient-5)"
            >
              <path
                d="M5.33333333,20 L5.33333333,20 C4.92477191,19.8347571 4.46434426,19.8566823 4.07333333,20.06 L3.82,20.16 C3.62144353,20.2495614 3.42783225,20.3497051 3.24,20.46 C1.42,21.5066667 0.506666667,22.92 0.5,24.7133333 L0.5,25.5466667 C0.419649847,26.1139225 0.618303015,26.6850504 1.03333333,27.08 L1.03333333,27.08 L1.11333333,27.12 L2.66666667,28 L2.66666667,28 L2.66666667,28 L2.66666667,28 C3.11333333,28.24 3.82666667,28.08 4.79333333,27.5266667 C6.57111111,26.4866667 7.46,25.0777778 7.46,23.3 L7.46,22.4733333 C7.53887301,21.9136578 7.35709819,21.3486819 6.96666667,20.94 L6.96666667,20.94 L6.86,20.88 L5.39333333,20 L5.39333333,20 M0.94,3.10666667 L0.94,9.89333333 L0.94,9.89333333 L2.34,18.9666667 L2.34,18.9666667 L3.93333333,19.9 L3.93333333,19.9 L5.84,18.7866667 L7.25333333,8.05333333 L7.26666667,1.33333333 L5.67333333,0.413333333 L0.94,3.10666667 Z"
                id="Shape"
              ></path>
            </g>
            <g
              id="Layer0_9_MEMBER_1_MEMBER_1_FILL"
              transform="translate(29.333333, 18.000000)"
              fill="url(#linearGradient-6)"
            >
              <polygon
                id="Path"
                points="0.126666667 2.83333333 0.126666667 9.62 0.126666667 9.62 1.54 18.7133333 3.44666667 17.6 4.86 6.86666667 4.86 0.08 4.86 0.08"
              ></polygon>
            </g>
            <g
              id="Layer0_9_MEMBER_1_MEMBER_2_FILL"
              transform="translate(27.333333, 16.666667)"
              fill="url(#linearGradient-7)"
            >
              <polygon
                id="Path"
                points="2.11333333 10.98 2.11333333 10.98 2.11333333 4.19333333 6.83333333 1.46666667 5.26666667 0.52 5.26666667 0.52 0.546666667 3.25333333 0.546666667 10.04 0.546666667 10.04"
              ></polygon>
            </g>
            <g
              id="Layer0_9_MEMBER_1_MEMBER_3_FILL"
              transform="translate(28.666667, 37.333333)"
              fill="url(#linearGradient-8)"
            >
              <path
                d="M5.15333333,0.333333333 C4.83009608,0.217309883 4.47657059,0.217309883 4.15333333,0.333333333 L3.94666667,0.393333333 C3.66427192,0.512346778 3.39030541,0.650443718 3.12666667,0.806666667 C1.30888889,1.85555556 0.393333333,3.27111111 0.38,5.05333333 L0.38,5.88666667 C0.378721301,6.11000365 0.396564222,6.33304017 0.433333333,6.55333333 C0.467183543,6.90608122 0.651929039,7.22695497 0.94,7.43333333 L0.94,7.43333333 L0.94,7.43333333 C1.39333333,7.67333333 2.10666667,7.52 3.08,6.96 C4.85777778,5.92 5.74666667,4.51111111 5.74666667,2.73333333 L5.74666667,1.95333333 C5.82724606,1.39107772 5.63971504,0.823549632 5.24,0.42 L5.24,0.42 L5.15333333,0.333333333 Z"
                id="Path"
              ></path>
            </g>
            <g
              id="Layer0_9_MEMBER_1_MEMBER_4_FILL"
              transform="translate(27.333333, 36.666667)"
              fill="url(#linearGradient-9)"
            >
              <path
                d="M5.28,1.08666667 L5.48666667,1.02666667 C5.80990392,0.910643216 6.16342941,0.910643216 6.48666667,1.02666667 L4.98666667,0.173333333 L4.98666667,0.173333333 L4.98666667,0.173333333 C4.58373155,0.00891278994 4.12951515,0.0259155429 3.74,0.22 L3.48666667,0.333333333 C3.28811019,0.422894707 3.09449892,0.523038468 2.90666667,0.633333333 C1.09333333,1.68 0.173333333,3.1 0.166666667,4.88666667 L0.166666667,5.66666667 C0.166666667,6.44444444 0.34,6.95111111 0.686666667,7.18666667 L0.686666667,7.18666667 L0.773333333,7.23333333 L2.30666667,8.11333333 C2.01859571,7.90695497 1.83385021,7.58608122 1.8,7.23333333 C1.76323089,7.01304017 1.74538797,6.79000365 1.74666667,6.56666667 L1.74666667,5.74666667 C1.74666667,3.96888889 2.66222222,2.55333333 4.49333333,1.5 C4.74619652,1.34510054 5.00898752,1.20702392 5.28,1.08666667 L5.28,1.08666667 Z"
                id="Path"
              ></path>
            </g>
            <g
              id="Layer0_9_MEMBER_1_MEMBER_5_FILL"
              transform="translate(27.333333, 26.666667)"
              fill="url(#linearGradient-10)"
            >
              <polygon
                id="Path"
                points="2.11333333 0.98 0.52 0.06 1.92 9.13333333 1.92 9.13333333 3.51333333 10.0533333 3.51333333 10.0533333"
              ></polygon>
            </g>
            <g
              id="Layer0_9_MEMBER_2_FILL"
              transform="translate(23.333333, 46.000000)"
              fill="#A8A8A8"
            >
              <polygon id="Path" points="0.96 0.946666667 0.766666667 0.86 0.96 0.98"></polygon>
            </g>
          </g>
        </g>
      </g>
    </svg>
  `,
})
export class EmptyStateErrorIcon {
  /**
   * Classes to add to the icon
   */
  @Input() iconClass: string;
}
