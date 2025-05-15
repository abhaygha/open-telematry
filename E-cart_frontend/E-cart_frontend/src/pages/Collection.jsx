import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {
    const [showFilter, setShowFilter] = useState(false); 
    const [filterProducts, setFilterProducts] = useState([]);
    const [filters, setFilters] = useState([]);
    const [sortType,setSortType] = useState('relevant')
    const [selectedFilters, setSelectedFilters] = useState({});
    const [loading, setLoading] = useState(true); // Loading state
    const {search, setSearch} = useContext(ShopContext);

    const toggleCategory = (filterType, filterValue) => {
      setSelectedFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters };

        
        if (!updatedFilters[filterType]) {
          updatedFilters[filterType] = [];
        }
    
        // Check if filterValue already exists (Checkbox was checked)
        console.log("updatedFilters 000000000 ", updatedFilters)
        console.log('filterType ', filterType)
        console.log('filterValue ', filterValue)
        const isChecked = updatedFilters[filterType].includes(filterValue);
        if (isChecked) {
          // Checkbox was checked, now uncheck it
          updatedFilters[filterType] = updatedFilters[filterType].filter((item) => item !== filterValue);
        } else {
          // Checkbox was unchecked, now check it
          updatedFilters[filterType].push(filterValue);
        }
    
        console.log(`${filterValue} is now ${isChecked ? "unchecked" : "checked"}`); // Debugging
    
        // Save updated filters to localStorage
        localStorage.setItem("selectedFilters", JSON.stringify(updatedFilters));
    
        // Fetch products after updating filters
        fetchProducts(updatedFilters);
        
        return updatedFilters;
      });
    }

    const buildQueryParams = (filters, order_temp, searchTemp) => {
      const params = new URLSearchParams();
      if (!searchTemp) {
        searchTemp = search
      }
      if (searchTemp) {
        params.append("search", searchTemp);
      }
      Object.entries(filters).forEach(([key, value]) => {
        if (key === "price") {
          let min = 10000000
          let max= 0
          let found=false
          value.forEach((val) => {
            found = true
        
            const [minTemp, maxTemp] = val.split(" - ").map(Number);  // Convert strings to numbers
            if (minTemp < min) {
              min = minTemp
            }
            if (maxTemp > max) {
              max = maxTemp
            }
          });
          if (found != []){
            params.append("price__gte", min);
            params.append("price__lte", max);
          }
        } else {
          if (value != []) {
            console.log("search2 key vale ", key, value)
            params.append(key, value);
          }
        }
      });
      
      if (order_temp) {
        console.log()
      } else {
        order_temp = sortType
      }
      let orderingTemp = "bestseller"
      switch(order_temp){
        case 'high-low':
          orderingTemp = "-price"
          break;

        case 'low-high':
            orderingTemp = "price"
            break;

        default:
          break;
      }

      params.append("ordering", orderingTemp);

      return params.toString();
    };  

    const fetchProducts = async (added_filters, order_temp, searchTemp) => {
      try {
          const queryParams = buildQueryParams(added_filters, order_temp, searchTemp);
          const apiUrl = `http://127.0.0.1:8000/api/products?${queryParams}`;
          const response = await fetch(apiUrl);
          if (!response.ok) {
              throw new Error('Failed to fetch products');
          }
          const data = await response.json();
          const productData = data.results || [];
          const temp_filters = data.filters;
          // setProducts(data);
          setFilterProducts(productData);
          setFilters(temp_filters);
          setLoading(false);
      } catch (err) {
          // setError(err.message);
          setLoading(false);
      }
    }

    useEffect(() => {
      setLoading(true);
      console.log("useffect--")
      console.log("search2123 ", search)
      console.log("search2 ", selectedFilters)
      fetchProducts(selectedFilters, null, search);
    }, [selectedFilters]);

    useEffect(() => {
      setLoading(true);
      console.log("search1 ", search)
      fetchProducts(selectedFilters, sortType, search)
  }, [search]);

    const sortProduct = (value) =>{
      setLoading(true);
      setSortType(value)

      setTimeout(async () => {
        fetchProducts(selectedFilters, value, search)
      }, 20);
    }

    return (
      <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>

        {/* FILTER OPTIONS */}
        <div className='min-w-60'>
          <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
            <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
          </p>

            {Object.entries(filters).map(([filterType, values]) => (
              <>
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                  <p className='mb-3 text-sm font-medium' style={{ textTransform: 'uppercase' }}>{filterType}</p>
                  <div key={filterType} className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                    {Object.entries(values).map(([key, count]) => (
                      <>
                        <p className='flex gap-2' key={key}>
                        <input
                          className='w-3' type="checkbox" style={{ textTransform: 'uppercase' }} value={key} 
                          checked={selectedFilters[filterType]?.includes(key) || false}
                          onChange={() => toggleCategory(filterType, key)}/>{key} &nbsp; ({count})
                        {/* onChange={toggleCategory}  */}
                      </p>
                      </>
                    ))}
                  </div>
                </div>
              </>
            ))}
        </div>

        {/* Right Side */}
        <div className='flex-1'>
            <div className='flex justify-between text-base sm:text-2xl mb-4'>
                <Title text1={'ALL'} text2={'COLLECTIONS'}/>
                {/* product sort */}
                <select  onChange={(e) => sortProduct(e.target.value)} className='border border-gray-300 text-sm px-2'>
                  <option value="relevant">Sort by: Relevant</option>
                  <option value="low-high">Sort by: Low to High</option>
                  <option value="high-low">Sort by: High to Low</option>
                </select>
            </div>

            {/* map products */}
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
              { !loading &&
                filterProducts.map((item,index) => (
                  <ProductItem key={index} name={item.name} id={item.id} price={item.price} image={item.images}/>
                ))
              }
            </div>

        </div>
          
      </div>
    )
}

export default Collection