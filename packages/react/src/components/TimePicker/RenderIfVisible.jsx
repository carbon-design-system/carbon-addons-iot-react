// import React, { useMemo, useState, useRef, useEffect } from 'react'
// import PropTypes from 'prop-types';

// const propTypes = {
//   /**
//    * Whether the element should be visible initially or not.
//    * Useful e.g. for always setting the first N items to visible.
//    * Default: false
//    */
//   initialVisible: PropTypes.bool,
//   /** An estimate of the element's height */
//   defaultHeight: PropTypes.number
//   /** How far outside the viewport in pixels should elements be considered visible?  */
//   visibleOffset: PropTypes.number
//   /** Should the element stay rendered after it becomes visible? */
//   stayRendered: PropTypes.boolean
//   root: PropTypes.string
//   /** E.g. 'span', 'tbody'. Default = 'div' */
//   rootElement: PropTypes.string
//   rootElementClass: PropTypes.string
//   /** E.g. 'span', 'tr'. Default = 'div' */
//   placeholderElement: PropTypes.string
//   placeholderElementClass: PropTypes.string
//   children: PropTypes.node
// }

// const defaultProps = {
//   initialVisible: false,
//   defaultHeight: 300,
//   visibleOffset: 1000,
//   stayRendered: false,
//   root: null,
//   rootElement: 'div',
//   rootElementClass: undefined,
//   placeholderElement: 'div',
//   placeholderElementClass: undefined,
// }

// const RenderIfVisible = ({
//   initialVisible,
//   defaultHeight,
//   visibleOffset,
//   stayRendered,
//   root,
//   rootElement: RootElement,
//   rootElementClass,
//   placeholderElement: PlaceholderElement,
//   placeholderElementClass,
//   children,
// }) => {
//   const [isVisible, setIsVisible] = useState(initialVisible)
//   const wasVisible = useRef(initialVisible)
//   const placeholderHeight = useRef(defaultHeight)
//   const intersectionRef = useRef(null)

//   // Set visibility with intersection observer
//   useEffect(() => {
//     if (intersectionRef.current) {
//       const observer = new IntersectionObserver(
//         (entries) => {
//           // Before switching off `isVisible`, set the height of the placeholder
//           if (!entries[0].isIntersecting) {
//             placeholderHeight.current = intersectionRef.current.offsetHeight
//           }
//           if (typeof window !== undefined && window.requestIdleCallback) {
//             window.requestIdleCallback(
//               () => setIsVisible(entries[0].isIntersecting),
//               {
//                 timeout: 600,
//               }
//             )
//           } else {
//             setIsVisible(entries[0].isIntersecting)
//           }
//         },
//         { root, rootMargin: `${visibleOffset}px 0px ${visibleOffset}px 0px` }
//       )
//       observer.observe(intersectionRef.current)
//       return () => {
//         if (intersectionRef.current) {
//           observer.unobserve(intersectionRef.current)
//         }
//       }
//     }
//     return () => {}
//   }, [])

//   useEffect(() => {
//     if (isVisible) {
//       wasVisible.current = true
//     }
//   }, [isVisible])

//   const placeholderStyle = { height: placeholderHeight.current }
//   const rootClasses = useMemo(
//     () => `renderIfVisible ${rootElementClass}`,
//     [rootElementClass]
//   )
//   const placeholderClasses = useMemo(
//     () => `renderIfVisible-placeholder ${placeholderElementClass}`,
//     [placeholderElementClass]
//   )

//   return (
//     <RootElement ref={intersectionRef} className={rootClasses}>
//       {isVisible || (stayRendered && wasVisible.current) ?
//         (
//           children
//         ) :
//         (
//           <PlaceholderElement className={placeholderClasses} style={placeholderStyle} />
//         )
//       }
//     </RootElement>
//   )
// }

// export default RenderIfVisible
