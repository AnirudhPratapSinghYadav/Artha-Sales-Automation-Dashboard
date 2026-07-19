'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Lead, ScoreTier } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { MessageSquare, Calendar } from 'lucide-react';
import clsx from 'clsx';

interface KanbanBoardProps {
  leads: Lead[];
  onLeadMove: (leadId: string, newTier: ScoreTier) => void;
  onLeadClick: (lead: Lead) => void;
}

const COLUMNS: { id: ScoreTier, title: string }[] = [
  { id: 'Dormant', title: 'Dormant' },
  { id: 'Exploring', title: 'Exploring' },
  { id: 'Engaged', title: 'Engaged' },
  { id: 'Qualified', title: 'Qualified' },
  { id: 'Sales Ready', title: 'Sales Ready' },
];

export function KanbanBoard({ leads, onLeadMove, onLeadClick }: KanbanBoardProps) {
  // We need local state for immediate visual updates during drag
  const [boardData, setBoardData] = useState<Record<string, Lead[]>>({});

  useEffect(() => {
    // Group leads by tier
    const grouped: Record<string, Lead[]> = {
      'Dormant': [],
      'Exploring': [],
      'Engaged': [],
      'Qualified': [],
      'Sales Ready': [],
    };
    leads.forEach(lead => {
      if (grouped[lead.lead_score_band as ScoreTier]) {
        grouped[lead.lead_score_band as ScoreTier].push(lead);
      }
    });
    setBoardData(grouped);
  }, [leads]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceTier = source.droppableId as ScoreTier;
    const destTier = destination.droppableId as ScoreTier;

    // Move locally first for snappy UI
    const newBoard = { ...boardData };
    const sourceList = [...newBoard[sourceTier]];
    const destList = sourceTier === destTier ? sourceList : [...newBoard[destTier]];
    
    const [movedLead] = sourceList.splice(source.index, 1);
    
    if (sourceTier === destTier) {
      sourceList.splice(destination.index, 0, movedLead);
      newBoard[sourceTier] = sourceList;
    } else {
      const updatedLead = { ...movedLead, signals: { ...movedLead.signals, tier: destTier } };
      destList.splice(destination.index, 0, updatedLead);
      newBoard[sourceTier] = sourceList;
      newBoard[destTier] = destList;
    }

    setBoardData(newBoard);
    
    // Notify parent to actually save and trigger n8n webhooks
    if (sourceTier !== destTier) {
      onLeadMove(draggableId, destTier);
    }
  };

  const getStatusColor = (tier: string) => {
    switch(tier) {
      case 'Dormant': return 'border-t-zinc-400';
      case 'Exploring': return 'border-t-indigo-400';
      case 'Engaged': return 'border-t-amber-400';
      case 'Qualified': return 'border-t-orange-400';
      case 'Sales Ready': return 'border-t-emerald-400';
      default: return 'border-t-gray-400';
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-220px)] hide-scrollbar">
        {COLUMNS.map(column => (
          <div key={column.id} className="flex flex-col min-w-[300px] w-[300px] bg-gray-50/50 rounded-xl">
            <div className={clsx("p-3 font-semibold text-gray-700 flex justify-between items-center border-t-4 rounded-t-xl", getStatusColor(column.id))}>
              <span className="capitalize">{column.title}</span>
              <span className="bg-white text-gray-500 text-xs px-2 py-1 rounded-full border shadow-sm">
                {boardData[column.id]?.length || 0}
              </span>
            </div>
            
            <Droppable droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={clsx(
                    "flex-1 p-3 overflow-y-auto min-h-[150px] transition-colors rounded-b-xl",
                    snapshot.isDraggingOver ? "bg-gray-100" : "bg-transparent"
                  )}
                >
                  {boardData[column.id]?.map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-3"
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          <Card 
                            className={clsx(
                              "cursor-grab active:cursor-grabbing hover:border-primary-300 transition-all shadow-sm",
                              snapshot.isDragging ? "shadow-lg scale-105 rotate-2 z-50 ring-2 ring-primary-500" : ""
                            )}
                            bodyClassName="p-4"
                            onClick={() => onLeadClick(lead)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-gray-900 text-sm truncate pr-2">
                                {lead.first_name} {lead.last_name}
                              </h4>
                              <span className={clsx(
                                "text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0",
                                lead.lead_score_total >= 80 ? "bg-emerald-100 text-emerald-700" :
                                lead.lead_score_total >= 50 ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-600"
                              )}>
                                {lead.lead_score_total}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 truncate mb-3">{lead.company}</p>
                            
                            <div className="flex items-center justify-between text-xs text-gray-400 mt-2 pt-2 border-t border-gray-100">
                              <span>{formatDistanceToNow(parseISO(lead.updated_at))} ago</span>
                              <div className="flex gap-2">
                                <MessageSquare className="w-3.5 h-3.5" />
                                <Calendar className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          </Card>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
