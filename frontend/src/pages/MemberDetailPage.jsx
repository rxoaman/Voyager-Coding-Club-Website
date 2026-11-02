import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MemberDetail from '../components/MemberDetail';
import { fetchMemberById } from '../services/api';
import { getTeamMemberById } from '../data/clubData';

export default function MemberDetailPage() {
  const { id } = useParams();
  // Initialize synchronously with embedded data if matched
  const [member, setMember] = useState(() => getTeamMemberById(id));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadMember() {
      try {
        const data = await fetchMemberById(id);
        if (isMounted && data) {
          setMember(data);
        }
      } catch (err) {
        console.warn(`Error syncing member ${id}:`, err);
      }
    }

    if (!member) {
      setLoading(true);
      loadMember().finally(() => {
        if (isMounted) setLoading(false);
      });
    } else {
      loadMember();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading && !member) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-3 font-mono text-sm text-[#00FF88]">
          <div className="w-8 h-8 rounded-full border-2 border-[#00FF88] border-t-transparent animate-spin" />
          <span>DECRYPTING MEMBER DOSSIER...</span>
        </div>
      </div>
    );
  }

  return <MemberDetail member={member} />;
}
