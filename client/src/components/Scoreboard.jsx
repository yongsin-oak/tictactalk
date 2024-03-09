import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { SlActionUndo } from "react-icons/sl";

function Scoreboard() {
    const [userData, setUserData] = useState(Array);
    const [userTeamData, setUserTeamData] = useState(Array);
    const navigate = useNavigate();
    useEffect(() => {
        getUsersData();
    }, [])
    const getUsersData = async () => {
        const q = query(collection(db, "users"), orderBy("scores", "desc"));
        const q2 = query(collection(db, "users"), orderBy("TScores", "desc"));
        const querySnapshot = await getDocs(q);
        const querySnapshot2 = await getDocs(q2);
        const sortedData = querySnapshot.docs.map(doc => doc.data());
        const sortedData2 = querySnapshot2.docs.map(doc => doc.data());
        setUserData(sortedData);
        setUserTeamData(sortedData2);
    }

    return (
        <div className="container flex gap-5 p-5 mx-auto justify-center">
            <div className='absolute top-5 left-5'>
                <button onClick={() => { navigate('/') }} className=' text-2xl'>
                    <SlActionUndo size={50}></SlActionUndo>
                </button>
            </div>
            <div className='flex-grow'>
                <h1 className="text-2xl font-bold my-4 text-center">Single Match Scoreboard</h1>
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Win</th>
                            <th className="px-4 py-2">Draw</th>
                            <th className="px-4 py-2">Lose</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.map((player, index) => index < 10 && (
                            <tr key={index}>
                                <td className="border px-4 py-2">{player.email}</td>
                                <td className="border px-4 py-2">{player.wins}</td>
                                <td className="border px-4 py-2">{player.draws}</td>
                                <td className="border px-4 py-2">{player.losses}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className='flex-grow'>
                <h1 className="text-2xl font-bold my-4 text-center">Team Match Scoreboard</h1>
                <table className="table-auto w-full">
                    <thead>
                        <tr>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Win</th>
                            <th className="px-4 py-2">Draw</th>
                            <th className="px-4 py-2">Lose</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userTeamData.map((team, index) => index < 10 && (
                            <tr key={index}>
                                <td className="border px-4 py-2">{team.email}</td>
                                <td className="border px-4 py-2">{team.TWins}</td>
                                <td className="border px-4 py-2">{team.TDraws}</td>
                                <td className="border px-4 py-2">{team.TLosses}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default Scoreboard;
