// import React from 'react'
// import { Loading } from '@/components'

// export function WithLoadingHoc(WrappedComponent, data, emptyClassName) {
//   const Empty = () => <div className={`${emptyClassName} empty`}>没有数据</div>
//   return class extends WrappedComponent{
//     render(){
//     console.log(data,'jiii')
//   if (!data) {
//     Loading.show()
//     return <Loading />
//   } else if (!data.length) {
//     return <Empty />
//   } else {
//     return super.render()
//   }
// }
// }
// }