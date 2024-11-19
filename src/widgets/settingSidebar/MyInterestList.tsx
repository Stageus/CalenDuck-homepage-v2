import MyInterestItem from "widgets/settingSidebar/MyInterestItem";
import { useGetMyInterest } from "./hooks/useGetMyInterest";
import { useCancelToRegisterInterest } from "./hooks/useCancelToRegisterInterest";

type Props = {
  refetchInterest: () => void;
  refetchFlag: number;
};

const MyInterestList = ({ refetchInterest, refetchFlag }: Props) => {
  const { data: myInterests, refetch: refetchMyInterest } =
    useGetMyInterest(refetchFlag);
  const { mutate: cancelToRegister } = useCancelToRegisterInterest({
    onSuccess() {
      refetchInterest();
      refetchMyInterest();
    },
  });

  return (
    <article className="w-full">
      <div>
        <h3 className="text-[18px] font-medium mb-[4px]">내 관심사</h3>
        <span className="text-[9px] font-extralight mb-[16px]">
          최대 5개까지 선택 가능합니다
        </span>
      </div>

      <div className="w-full">
        {myInterests &&
          myInterests.list.map((item) => (
            <MyInterestItem
              key={item.interestIdx}
              data={item}
              onClick={(idx) => {
                cancelToRegister(idx);
              }}
            />
          ))}
      </div>
    </article>
  );
};

export default MyInterestList;
