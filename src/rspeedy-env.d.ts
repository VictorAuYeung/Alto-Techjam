/// <reference types="@lynx-js/rspeedy/client" />

declare module '@lynx-js/react' {
  namespace JSX {
    interface IntrinsicElements {
      input: any;
      textarea: any;
      view: any;
      text: any;
      image: any;
    }
  }

  export const root: {
    render: (element: any) => void;
  };
}

declare namespace JSX {
  interface IntrinsicElements {
    input: any;
    textarea: any;
    view: any;
    text: any;
    image: any;
  }
}
