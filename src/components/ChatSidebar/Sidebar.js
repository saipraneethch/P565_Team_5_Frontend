import Conversations from "./Conversations";
import "../../styles/ChatStyles/index.css";

const Sidebar = ({conversations}) => {
    return (
        <div className="sidebar-container">
            {/* border-r border-gray-500 p-4 flex flex-col */}
            {/* could input search here */}
            < Conversations conversations={conversations}/>
            {/* could input logout here */}
        </div>
    )
}
export default Sidebar;