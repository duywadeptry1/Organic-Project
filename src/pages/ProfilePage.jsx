import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useProfileMutation } from '../slices/usersApiSlice';
import { setCredentials } from '../slices/authSlice';
import { useGetMyOrdersQuery } from '../slices/ordersApiSlice';

function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [successNotice, setSuccessNotice] = useState(false);

  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      setMessage(null);
      const res = await updateProfile({ _id: userInfo._id, name, email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      setSuccessNotice(true);
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => setSuccessNotice(false), 3000);
    } catch (err) {
      setMessage(err?.data?.message || err.error || 'Failed to update profile');
    }
  };

  return (
    <div className="bg-[#FDFBF7] min-h-screen py-10">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">
            My Account & Orders
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Manage your personal credentials, harvest delivery preferences, and view past purchases.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Account Info Form */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-xs border border-stone-200/80">
              <h2 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100 flex items-center justify-between">
                <span>Account Profile</span>
                {userInfo?.isAdmin && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    ADMIN
                  </span>
                )}
              </h2>

              {message && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl mb-4 font-semibold">
                  {message}
                </div>
              )}

              {successNotice && (
                <div className="bg-green-50 border border-green-200 text-green-800 text-xs p-3 rounded-xl mb-4 font-semibold">
                  ✓ Profile updated successfully!
                </div>
              )}

              <form onSubmit={submitHandler} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    New Password <span className="text-stone-400 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="password"
                    placeholder="Leave blank to keep same"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 text-stone-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loadingUpdateProfile}
                  className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl text-sm transition duration-200 shadow-sm disabled:opacity-50"
                >
                  {loadingUpdateProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Order History */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-7 rounded-3xl shadow-xs border border-stone-200/80">
              <h2 className="text-lg font-bold text-stone-900 mb-4 pb-2 border-b border-stone-100">
                Order History
              </h2>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 text-red-700 text-xs p-4 rounded-2xl">
                  {error?.data?.message || error.error || 'Failed to load orders'}
                </div>
              ) : !orders || orders.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-stone-500 text-sm mb-3">You haven't placed any orders yet.</p>
                  <Link
                    to="/shop"
                    className="inline-block bg-green-600 text-white text-xs font-bold py-2.5 px-5 rounded-xl hover:bg-green-700 transition"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-stone-100 text-stone-400 font-bold uppercase tracking-wider">
                        <th className="pb-3 pr-2">Order ID</th>
                        <th className="pb-3 px-2">Date</th>
                        <th className="pb-3 px-2">Total</th>
                        <th className="pb-3 px-2">Paid</th>
                        <th className="pb-3 px-2">Delivered</th>
                        <th className="pb-3 pl-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-stone-50/60 transition">
                          <td className="py-3.5 pr-2 font-mono font-medium text-stone-900">
                            #{order._id.substring(0, 8)}...
                          </td>
                          <td className="py-3.5 px-2 text-stone-600">
                            {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="py-3.5 px-2 font-bold text-stone-900">
                            ${(order.totalPrice || 0).toFixed(2)}
                          </td>
                          <td className="py-3.5 px-2">
                            {order.isPaid ? (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-green-50 text-green-700 font-bold text-[10px]">
                                Paid
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-red-50 text-red-600 font-bold text-[10px]">
                                Unpaid
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-2">
                            {order.isDelivered ? (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-green-50 text-green-700 font-bold text-[10px]">
                                Delivered
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold text-[10px]">
                                Processing
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 pl-2 text-right">
                            <Link
                              to={`/order/${order._id}`}
                              className="inline-block bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] py-1 px-3 rounded-lg transition"
                            >
                              View &rarr;
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;