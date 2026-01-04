import { useState, useEffect } from "react";
import AdminLayout from "../layouts/AdminLayout";

export default function Menus() {
  const [activeTab, setActiveTab] = useState("dishes");
  const [dishes, setDishes] = useState([]);
  const [packages, setPackages] = useState([]);
  const [inventory, setInventory] = useState([]);

  // Load Data
  useEffect(() => {
    const savedDishes = JSON.parse(localStorage.getItem("dishes")) || [];
    const savedPackages = JSON.parse(localStorage.getItem("packages")) || [];
    const savedInventory = JSON.parse(localStorage.getItem("inventory")) || [];
    setDishes(savedDishes);
    setPackages(savedPackages);
    setInventory(savedInventory);
  }, []);

  // Save Data
  useEffect(() => { localStorage.setItem("dishes", JSON.stringify(dishes)); }, [dishes]);
  useEffect(() => { localStorage.setItem("packages", JSON.stringify(packages)); }, [packages]);

  // --- DISH MANAGEMENT ---
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [currentDish, setCurrentDish] = useState({ name: "", category: "Main Course", sellingPrice: "", ingredients: [] });
  
  // Recipe Builder State
  const [selectedIngId, setSelectedIngId] = useState("");
  const [ingQty, setIngQty] = useState("");

  const addIngredientToDish = () => {
    if (!selectedIngId || !ingQty) return;
    const invItem = inventory.find(i => i.id === parseInt(selectedIngId));
    if (!invItem) return;

    const cost = parseFloat(ingQty) * (parseFloat(invItem.unitPrice) || 0);
    const newIng = { 
      id: invItem.id, 
      name: invItem.item, 
      unit: invItem.unit, 
      qty: parseFloat(ingQty), 
      cost: cost 
    };

    setCurrentDish({ ...currentDish, ingredients: [...currentDish.ingredients, newIng] });
    setSelectedIngId("");
    setIngQty("");
  };

  const removeIngredient = (index) => {
    const updated = [...currentDish.ingredients];
    updated.splice(index, 1);
    setCurrentDish({ ...currentDish, ingredients: updated });
  };

  const calculateDishCost = (ingredients) => {
    return ingredients.reduce((sum, item) => sum + item.cost, 0);
  };

  const handleSaveDish = (e) => {
    e.preventDefault();
    const costPrice = calculateDishCost(currentDish.ingredients);
    const newDish = { ...currentDish, id: Date.now(), costPrice };
    setDishes([...dishes, newDish]);
    setIsDishModalOpen(false);
  };

  // --- PACKAGE MANAGEMENT ---
  const [isPkgModalOpen, setIsPkgModalOpen] = useState(false);
  const [currentPkg, setCurrentPkg] = useState({ name: "", type: "Wedding", pricePerPax: "", selectedDishIds: [] });
  
  // Dynamic Pricing Engine State
  const [pricingParams, setPricingParams] = useState({
    operationalCost: 50,
    marginPercent: 30,
    isWeekend: false,
    isPeakSeason: false,
    paxCount: 200
  });

  // Real-time Cost Calculation
  const pkgFoodCost = currentPkg.selectedDishIds.reduce((sum, id) => {
    const d = dishes.find(x => x.id === id);
    return sum + (d ? d.costPrice : 0);
  }, 0);

  const toggleDishInPkg = (dishId) => {
    const ids = currentPkg.selectedDishIds.includes(dishId)
      ? currentPkg.selectedDishIds.filter(id => id !== dishId)
      : [...currentPkg.selectedDishIds, dishId];
    setCurrentPkg({ ...currentPkg, selectedDishIds: ids });
  };

  // Dynamic Price Calculation
  const calculateDynamicPrice = () => {
    let price = (pkgFoodCost + parseFloat(pricingParams.operationalCost || 0)) * (1 + (parseFloat(pricingParams.marginPercent || 0) / 100));
    if (pricingParams.isWeekend) price *= 1.15;
    if (pricingParams.isPeakSeason) price *= 1.20;
    if (pricingParams.paxCount < 150) price *= 1.10;
    return price.toFixed(0);
  };

  const handleSavePkg = (e) => {
    e.preventDefault();
    setPackages([...packages, { ...currentPkg, id: Date.now() }]);
    setIsPkgModalOpen(false);
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Menu Engineering</h1>
          <p className="text-gray-500 text-sm">Create dishes, build recipes, and design packages.</p>
        </div>
        <div className="flex gap-2">
          {activeTab === "dishes" ? (
            <button onClick={() => { setCurrentDish({ name: "", category: "Main Course", sellingPrice: "", ingredients: [] }); setIsDishModalOpen(true); }} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">
              + Create Dish
            </button>
          ) : (
            <button onClick={() => { setCurrentPkg({ name: "", type: "Wedding", pricePerPax: "", selectedDishIds: [] }); setIsPkgModalOpen(true); }} className="bg-pink-600 text-white px-4 py-2 rounded-lg shadow hover:bg-pink-700 transition cursor-pointer">
              + Create Package
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button onClick={() => setActiveTab("dishes")} className={`px-6 py-3 font-medium text-sm ${activeTab === "dishes" ? "border-b-2 border-pink-600 text-pink-600" : "text-gray-500"}`}>Dishes & Recipes</button>
        <button onClick={() => setActiveTab("packages")} className={`px-6 py-3 font-medium text-sm ${activeTab === "packages" ? "border-b-2 border-pink-600 text-pink-600" : "text-gray-500"}`}>Menu Packages</button>
      </div>

      {/* DISHES TABLE */}
      {activeTab === "dishes" && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th className="px-6 py-3">Dish Name</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Food Cost (Auto)</th>
                <th className="px-6 py-3">Selling Price</th>
                <th className="px-6 py-3">Margin</th>
              </tr>
            </thead>
            <tbody>
              {dishes.map(dish => {
                const margin = dish.sellingPrice ? ((dish.sellingPrice - dish.costPrice) / dish.sellingPrice * 100).toFixed(1) : 0;
                return (
                  <tr key={dish.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{dish.name}</td>
                    <td className="px-6 py-4">{dish.category}</td>
                    <td className="px-6 py-4 text-red-600 font-medium">₹{dish.costPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 text-green-600 font-medium">₹{dish.sellingPrice}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs ${margin > 60 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {margin}%
                      </span>
                    </td>
                  </tr>
                );
              })}
              {dishes.length === 0 && <tr><td colSpan="5" className="p-6 text-center text-gray-400">No dishes created yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* PACKAGES TABLE */}
      {activeTab === "packages" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map(pkg => (
            <div key={pkg.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{pkg.name}</h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{pkg.type}</span>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-pink-600">₹{pkg.pricePerPax}</p>
                  <p className="text-xs text-gray-500">per plate</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 font-medium mb-2">Includes {pkg.selectedDishIds.length} Items:</p>
                <ul className="text-sm text-gray-500 list-disc list-inside">
                  {pkg.selectedDishIds.slice(0, 3).map(id => {
                    const d = dishes.find(x => x.id === id);
                    return d ? <li key={id}>{d.name}</li> : null;
                  })}
                  {pkg.selectedDishIds.length > 3 && <li>+{pkg.selectedDishIds.length - 3} more...</li>}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE DISH MODAL */}
      {isDishModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Dish</h2>
            <form onSubmit={handleSaveDish} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Dish Name</label>
                  <input type="text" required className="w-full mt-1 p-2 border rounded" value={currentDish.name} onChange={e => setCurrentDish({...currentDish, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select className="w-full mt-1 p-2 border rounded" value={currentDish.category} onChange={e => setCurrentDish({...currentDish, category: e.target.value})}>
                    <option>Starter</option>
                    <option>Main Course</option>
                    <option>Dessert</option>
                    <option>Beverage</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Selling Price (₹)</label>
                <input type="number" required className="w-full mt-1 p-2 border rounded" value={currentDish.sellingPrice} onChange={e => setCurrentDish({...currentDish, sellingPrice: e.target.value})} />
              </div>

              {/* RECIPE BUILDER */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="font-medium text-gray-800 mb-2">Recipe & Costing</h3>
                <div className="flex gap-2 mb-2">
                  <select className="flex-1 p-2 border rounded text-sm" value={selectedIngId} onChange={e => setSelectedIngId(e.target.value)}>
                    <option value="">Select Ingredient from Inventory...</option>
                    {inventory.map(i => <option key={i.id} value={i.id}>{i.item} (₹{i.unitPrice}/{i.unit})</option>)}
                  </select>
                  <input type="number" placeholder="Qty" className="w-20 p-2 border rounded text-sm" value={ingQty} onChange={e => setIngQty(e.target.value)} />
                  <button type="button" onClick={addIngredientToDish} className="bg-blue-600 text-white px-3 rounded text-sm">Add</button>
                </div>
                
                {/* Ingredients List */}
                <table className="w-full text-sm text-left bg-white border rounded">
                  <thead className="bg-gray-100 text-xs uppercase">
                    <tr><th className="p-2">Item</th><th className="p-2">Qty</th><th className="p-2">Cost</th><th className="p-2">Action</th></tr>
                  </thead>
                  <tbody>
                    {currentDish.ingredients.map((ing, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="p-2">{ing.name}</td>
                        <td className="p-2">{ing.qty} {ing.unit}</td>
                        <td className="p-2">₹{ing.cost.toFixed(2)}</td>
                        <td className="p-2"><button type="button" onClick={() => removeIngredient(idx)} className="text-red-500">x</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="text-right mt-2 font-bold text-gray-700">
                  Total Food Cost: ₹{calculateDishCost(currentDish.ingredients).toFixed(2)}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsDishModalOpen(false)} className="px-4 py-2 bg-gray-200 rounded cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded cursor-pointer">Save Dish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PACKAGE MODAL */}
      {isPkgModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create Menu Package</h2>
            <form onSubmit={handleSavePkg} className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Details & Selection */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Package Name</label>
                  <input type="text" required className="w-full mt-1 p-2 border rounded" value={currentPkg.name} onChange={e => setCurrentPkg({...currentPkg, name: e.target.value})} placeholder="e.g. Gold Wedding Package" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Event Type</label>
                  <select className="w-full mt-1 p-2 border rounded" value={currentPkg.type} onChange={e => setCurrentPkg({...currentPkg, type: e.target.value})}>
                    <option>Wedding</option>
                    <option>Corporate</option>
                    <option>Social</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Dishes</label>
                  <div className="border rounded h-64 overflow-y-auto p-2 space-y-2">
                    {dishes.map(dish => (
                      <div key={dish.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded border-b border-gray-100">
                        <input type="checkbox" checked={currentPkg.selectedDishIds.includes(dish.id)} onChange={() => toggleDishInPkg(dish.id)} />
                        <span className="text-sm flex-1">{dish.name}</span>
                        <span className="text-xs text-gray-500">₹{dish.costPrice.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-right text-xs text-gray-500 mt-1">Total Food Cost: ₹{pkgFoodCost.toFixed(2)}</p>
                </div>
              </div>

              {/* Right Column: Dynamic Pricing Engine */}
              <div className="bg-pink-50 p-6 rounded-xl border border-pink-100">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">⚡ Dynamic Pricing Engine</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Base Food Cost:</span>
                    <span className="font-medium">₹{pkgFoodCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Operational Cost (Labor/Fuel):</span>
                    <input type="number" className="w-20 p-1 border rounded text-right" value={pricingParams.operationalCost} onChange={e => setPricingParams({...pricingParams, operationalCost: e.target.value})} />
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <span>Target Margin (%):</span>
                    <input type="number" className="w-20 p-1 border rounded text-right" value={pricingParams.marginPercent} onChange={e => setPricingParams({...pricingParams, marginPercent: e.target.value})} />
                  </div>

                  <div className="pt-2 space-y-2">
                    <label className="flex items-center gap-2"><input type="checkbox" checked={pricingParams.isWeekend} onChange={e => setPricingParams({...pricingParams, isWeekend: e.target.checked})} /> Weekend Event (+15%)</label>
                    <label className="flex items-center gap-2"><input type="checkbox" checked={pricingParams.isPeakSeason} onChange={e => setPricingParams({...pricingParams, isPeakSeason: e.target.checked})} /> Peak Season (+20%)</label>
                    <div className="flex items-center gap-2">
                      <span>Guest Count:</span>
                      <input type="number" className="w-20 p-1 border rounded" value={pricingParams.paxCount} onChange={e => setPricingParams({...pricingParams, paxCount: e.target.value})} />
                      <span className="text-xs text-gray-500">{pricingParams.paxCount < 150 ? "(Low PAX +10%)" : ""}</span>
                    </div>
                  </div>

                  <div className="mt-6 bg-white p-4 rounded border text-center">
                    <p className="text-gray-500 text-xs uppercase tracking-wide">Recommended Selling Price</p>
                    <p className="text-3xl font-bold text-pink-600">₹{calculateDynamicPrice()}</p>
                    <button type="button" onClick={() => setCurrentPkg({...currentPkg, pricePerPax: calculateDynamicPrice()})} className="mt-2 text-xs text-blue-600 hover:underline">Use This Price</button>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mt-4">Final Package Price</label>
                    <input type="number" required className="w-full mt-1 p-2 border rounded font-bold" value={currentPkg.pricePerPax} onChange={e => setCurrentPkg({...currentPkg, pricePerPax: e.target.value})} />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6">
                  <button type="button" onClick={() => setIsPkgModalOpen(false)} className="px-4 py-2 bg-white border rounded cursor-pointer">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded shadow hover:bg-pink-700 cursor-pointer">Save Package</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}