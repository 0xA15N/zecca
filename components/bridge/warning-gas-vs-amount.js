import { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { IoWarning } from "react-icons/io5";

import { toArray, equalsIgnoreCase } from "../../lib/utils";

export default ({
  threshold = 0.05,
  amount,
  assetPrice,
  gasFee,
  gasSymbol,
}) => {
  const { gas_tokens_price } = useSelector(
    (state) => ({
      gas_tokens_price: state.gas_tokens_price,
    }),
    shallowEqual
  );
  const { gas_tokens_price_data } = { ...gas_tokens_price };

  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(false);
  }, [amount, gasFee, gasSymbol]);

  const gas_token_data = toArray(gas_tokens_price_data).find((d) =>
    equalsIgnoreCase(d?.symbol, gasSymbol)
  );

  let { price } = { ...gas_token_data };

  price = price || (!gas_token_data && assetPrice);

  return (
    !hidden &&
    Number(amount) > 0 &&
    assetPrice > 0 &&
    Number(gasFee) > 0 &&
    price > 0 &&
    (Number(gasFee) * price) / (Number(amount) * assetPrice) >
      1 + threshold && (
      <div className="bg-slate-50 dark:bg-slate-800 rounded flex items-center justify-between space-x-2 py-2 pl-2 pr-2.5">
        <div className="flex items-start space-x-1.5">
          <IoWarning
            size={16}
            className="min-w-max text-yellow-600 dark:text-yellow-400 mt-0.5"
          />
          <div className="text-xs text-yellow-600 dark:text-yellow-400">
            The estimated destination gas fee is higher than {threshold * 100}%
            of the amount you're trying to bridge.
          </div>
        </div>
        <button
          onClick={() => setHidden(true)}
          className="rounded-xl text-black bg-[#BBFF00] hover:bg-[#00CC66] dark:[#BBFF00] dark:hover:bg-[#00CC66]  text-xs font-medium mt-0.5 py-1 px-1.5"
        >
          Accept
        </button>
      </div>
    )
  );
};
