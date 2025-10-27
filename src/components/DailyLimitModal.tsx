'use client';

import { useEffect, useRef } from 'react';

interface DailyLimitModalProps {
    open: boolean;
    onClose: () => void;     // fecha o modal (não desbloqueia o limite)
}

export default function DailyLimitModal({ open, onClose }: DailyLimitModalProps) {
    const dialogRef = useRef<HTMLDivElement>(null);
    const firstBtnRef = useRef<HTMLButtonElement>(null);

    // Foco inicial ao abrir
    useEffect(() => {
        if (open) {
            const prev = document.body.style.overflow;
            document.body.style.overflow = 'hidden';
            setTimeout(() => firstBtnRef.current?.focus(), 0);
            return () => {
                document.body.style.overflow = prev;
            };
        }
        return undefined; // ✅ Adiciona este retorno
    }, [open]);


    if (!open) return null;

    const OfflineIdeas = () => (
        <ul className="list-disc ms-6 text-sm leading-6 text-neutral-700">
            <li>Desenhar por 10 min</li>
            <li>Brincar de montar (blocos/LEGO)</li>
            <li>Ouvir 1 música e dançar</li>
            <li>Ler um livrinho curto</li>
            <li>Beber água e alongar</li>
        </ul>
    );

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="limit-title"
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            ref={dialogRef}
        >
            {/* backdrop */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />

            {/* card */}
            <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-black/10">
                <div className="p-6">
                    <h2 id="limit-title" className="text-xl font-semibold text-neutral-900">
                        Tempo de tela de hoje completo ✨
                    </h2>
                    <p className="mt-2 text-neutral-700">
                        Chegamos ao limite combinado de hoje. Que tal fazer uma pausa e escolher
                        uma atividade fora das telas?
                    </p>

                    <div className="mt-4">
                        <OfflineIdeas />
                    </div>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:justify-end">
                        <button
                            ref={firstBtnRef}
                            onClick={onClose}
                            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                        >
                            Encerrar por hoje
                        </button>

                        {/* Caso no futuro queira liberar “+5 min com PIN”, dá pra trocar este botão */}
                        <a
                            href="https://www.paho.org/pt/topicos/atividade-fisica" // referência geral sobre atividades (opcional)
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium bg-white text-neutral-900 ring-1 ring-neutral-300 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400"
                        >
                            Ideias de atividades offline
                        </a>
                    </div>
                </div>

                <div className="px-6 pb-6">
                    <p className="text-xs text-neutral-500">
                        Dica: Evite telas na última hora antes de dormir para melhorar o sono.
                    </p>
                </div>
            </div>
        </div>
    );
}
