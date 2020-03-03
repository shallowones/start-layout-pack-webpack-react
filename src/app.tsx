import React from 'react'
import Swiper from 'react-id-swiper/lib'
import 'styles/vendor.scss'
import 'styles/common.scss'
import { SomeComponent } from 'components/SomeComponent'
import { SecondComponent } from 'components/SecondComponent'

export const App = () => {
  return (
    <div>
      <span>some data 123</span>
      <SomeComponent />
      <SecondComponent />
      <Swiper>
        <div>slide 1</div>
        <div>slide 2</div>
        <div>slide 3</div>
      </Swiper>
    </div>
  )
}
