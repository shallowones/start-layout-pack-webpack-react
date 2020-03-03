declare module '*.scss' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames
  export = classNames
}

declare module '*.jpg' {
  const value: string
  export = value
}

declare module '*.png' {
  const value: string
  export = value
}

declare module '*.gif' {
  const value: string
  export = value
}

declare module '*.svg' {
  const value: string
  export = value
}
