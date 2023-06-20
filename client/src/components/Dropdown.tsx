import { useRef } from 'react';
import { BsCheckLg, BsChevronDown } from 'react-icons/bs';
import useOnOutsideClick from '@/hooks/useOnOutsideClick';

interface ItemProps {
  item: string;
  selectedOption: string;
  handleFontSizeChange: (fontSize: string) => void;
  handleClickDropdown: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
}

const Item: React.FC<ItemProps> = ({
  item,
  selectedOption,
  handleFontSizeChange,
  handleClickDropdown,
}) => (
  <li className="relative flex h-8 cursor-pointer select-none py-1.5 pl-2 text-label-2 dark:text-dark-label-2 hover:bg-dark-fill-3 rounded-lg">
    <button
      className={`flex h-5 flex-1 items-center pr-2 ${
        selectedOption === item ? 'font-medium' : ''
      }`}
      type="button"
      onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        handleClickDropdown(e);
        handleFontSizeChange(item);
      }}
    >
      <div className="whitespace-nowrap">{item}</div>
    </button>
    <span
      className={`text-blue dark:text-dark-blue flex items-center pr-2 ${
        selectedOption === item ? 'visible' : 'invisible'
      }`}
    >
      <BsCheckLg />
    </span>
  </li>
);

interface DropdownProps {
  label: string;
  desc: string;
  handleClickDropdown: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void;
  value: any;
  show: boolean;
  handleClickItem: (...args: any) => void;
  items: string[];
}

const Dropdown: React.FC<DropdownProps> = ({
  handleClickItem,
  show,
  handleClickDropdown,
  value,
  label,
  items,
  desc,
}) => {
  const outsideClickRef = useRef(null);
  useOnOutsideClick(
    outsideClickRef,
    show ? (handleClickDropdown as any) : undefined
  );
  return (
    <div className="mt-6 flex justify-between first:mt-0">
      <div className="w-[340px]">
        <h3 className=" text-base font-medium">{label}</h3>
        <h3 className="text-label-3  mt-1.5">{desc}</h3>
      </div>
      <div className="w-[200px]">
        <div className="relative" ref={outsideClickRef}>
          <button
            onClick={handleClickDropdown}
            className="flex cursor-pointer items-center rounded px-3 py-1.5 text-left focus:outline-none whitespace-nowrap bg bg-dark-fill-3 hover:bg-dark-fill-2 active:bg-dark-fill-3 w-full justify-between"
            type="button"
          >
            {value || items[0]}
            <BsChevronDown />
          </button>
          {show && (
            <ul
              className="absolute mt-1 max-h-56 overflow-auto rounded-lg p-2 z-50 focus:outline-none shadow-lg   w-full bg-dark-layer-1"
              style={{
                filter:
                  'drop-shadow(rgba(0, 0, 0, 0.04) 0px 1px 3px) drop-shadow(rgba(0, 0, 0, 0.12) 0px 6px 16px)',
              }}
            >
              {items.map((item, idx) => (
                <Item
                  key={idx}
                  item={item}
                  selectedOption={value}
                  handleFontSizeChange={handleClickItem}
                  handleClickDropdown={handleClickDropdown}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
