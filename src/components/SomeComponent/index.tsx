import React from 'react'
import cn from 'classnames'
import css from './styles.scss'
import Logo from 'images/logo.svg'
import img from 'images/2.png'

export const SomeComponent = () => {
  const [opened, setOpened] = React.useState(false)

  return (
    <>
      <h1>hi there</h1>
      <div className={css.logo}>
        <Logo />
      </div>
      <div className={cn('asd', css.trueClass)}>
        <img src={img} width={100} alt="" />
        {opened && <b>HELLO!</b>}
      </div>
    </>
  )
}
