/* eslint-disable react/prop-types */
import MainBoxStyle from "./style/MainBoxStyle";
import CardBox from "./CardBox";

// eslint-disable-next-line react/prop-types
function MainBox({
  heading = (
    <h1 className="text-white  text-[24px]">
      <span className="text-orange">No</span> Heading
    </h1>
  ),
  list_items = [
    { name: "BTC", percentage: 90, logo: "bitcoin" },
    { name: "BTC", percentage: 90, logo: "bitcoin" },
  ],
}) {
  return (
    <MainBoxStyle>
      {heading}
      {list_items.map((item, id) => (
        <CardBox
          name={item.name}
          key={id}
          index={id}
          percentage={item.percentage}
          logo={item.logo}
        />
      ))}
    </MainBoxStyle>
  );
}

export default MainBox;
