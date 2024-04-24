import React from 'react'
import { Iposts } from '../../../../constants/OrgQueryFN'

function PostCard({post } : {post : Iposts})  {
    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg">
            <div className="flex items-center px-6 py-4">
                <img className="w-10 h-10 rounded-full mr-4" src={post.postOwner.avatar ? post.postOwner.avatar : ""} alt="" />
                <div>
                    <div className="font-bold text-base mb-2"> {post.postOwner.name}</div>
                </div>
            </div>
            <img className="w-full" src={post.photo ? post.photo : ""}  alt="Image" />
            <div className="px-6 py-4">
                
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Like
                </button>
                <span className="ml-2">{post.likes.length}</span>
            </div>
            {/* <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Comments Section</div>
                <textarea className="w-full px-3 py-2 border rounded" placeholder="Write a comment..."></textarea>
                <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Post
                </button>
            </div> */}
            {/* <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2">Post Owner</div>
                <span className="text-gray-700">Posted by: {post.}</span>
            </div> */}
        </div>
    );
}

export default PostCard