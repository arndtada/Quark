function injectForEachInsn(method, opcode, callback) {
    var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');

    var target = ASM.findFirstInstruction(method,
        opcode);

    while (target !== null) {
        var index = method.instructions.indexOf(target);
        var indexShift = callback(target, index);

        var newIndex = method.instructions.indexOf(target);
        if (newIndex !== -1)
            index = newIndex;
        else if (typeof indexShift === 'number')
            index += indexShift;

        target = ASM.findFirstInstructionAfter(method,
            opcode,
            index + 1);
    }

    return method;
}

function initializeCoreMod() {
    return {
        'change-sleeping-player-count': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.world.server.ServerWorld',
                'methodName': 'func_72854_c', // updateAllPlayersSleepingFlag
                'methodDesc': '()V'
            },
            'transformer': function(method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');

                return injectForEachInsn(method, Opcodes.PUTFIELD, function(target) {
                    if (target.name !== ASM.mapField("field_73068_P") || target.desc !== "Z") // allPlayersSleeping
                        return;

                    if (target.getPrevious() !== null && target.getPrevious().getOpcode() === Opcodes.ICONST_0)
                        return;

                    var newInstructions = new InsnList();

                    newInstructions.add(ASM.buildMethodCall(
                        "vazkii/quark/base/handler/AsmHooks",
                        "isEveryoneAsleep",
                        "(Z)Z",
                        ASM.MethodType.STATIC
                    ));

                    method.instructions.insertBefore(target, newInstructions);
                });
            }
        }
    }
}
