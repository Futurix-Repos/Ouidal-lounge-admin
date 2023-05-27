import { useAppDispatch } from "@/store/hooks";
import { toggleOrderFilter } from "@/store/slices/orders";

import OrdersFilter from "@/components/modals/orders-filter";
import { FunnelIcon } from "@heroicons/react/20/solid";

export default function OrderStatusTab() {
  const dispatch = useAppDispatch();

  return (
    <div className="space-y-4 mx-10 p-4 flex items-center justify-end">
      <div
        className={
          "border w-32 flex items-center justify-center rounded-md p-2 cursor-pointer"
        }
        onClick={() => dispatch(toggleOrderFilter())}
      >
        <FunnelIcon className="w-5 h-5 mr-2" />
        <button>FILTRES</button>
        <OrdersFilter />
      </div>
    </div>
  );
}
