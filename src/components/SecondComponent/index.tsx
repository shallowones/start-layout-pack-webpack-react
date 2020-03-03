import React from 'react'
import cn from 'classnames'
import css from './styles.scss'
// import commonCss from '../../main.scss'

export const SecondComponent = () => {
  const [opened, setOpened] = React.useState(false)

  // console.log('commonCss', commonCss)

  return <div className={cn('asd', css.someClass)}>{!opened && <b>HELLO!</b>}</div>
}
