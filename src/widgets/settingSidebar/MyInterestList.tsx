import MyInterestItem from "widgets/settingSidebar/MyInterestItem";
import { useGetMyInterest } from "./hooks/useGetMyInterest";

const MyInterestList = () => {
  const { data: myInterests } = useGetMyInterest();

  return (
    <article className="w-full">
      <div className="flex justify-start items-end">
        <h3 className="mr-[5px] font-semibold">내 관심사</h3>
        <span className="text-alertColor text-xs">
          최대 5개까지 선택 가능합니다
        </span>
      </div>

      <div className="w-full h-[250px] mt-[10px] flex flex-col justify-start border-dashed border-2 border-alertColor">
        {myInterests &&
          myInterests.list.map((item) => (
            <MyInterestItem
              key={item.interestIdx}
              data={item}
              onRemove={() => {}}
            />
          ))}
      </div>
    </article>
  );
};

export default MyInterestList;
