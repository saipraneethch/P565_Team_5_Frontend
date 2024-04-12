import GroupConversations from "./GroupConversations";
import "../../styles/ChatStyles/index.css";

const GroupSidebar = () => {
    return (
        <div className="sidebar-container">
            {/* border-r border-gray-500 p-4 flex flex-col */}
            {/* could input search here */}
            < GroupConversations />
            {/* could input logout here */}
        </div>
    )
}
export default GroupSidebar;