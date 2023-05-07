import OrdersList from "./list"
import OrderStatusTab from "./tabs"

export default function Orders() {
  return (
    <div>
      <OrderStatusTab />
      <OrdersList />
    </div>
  )
}
