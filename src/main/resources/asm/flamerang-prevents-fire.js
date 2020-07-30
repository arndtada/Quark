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
        'redirect-fire-resistance': {
            'target': {
                'type': 'METHOD',
                'class': 'net.minecraft.entity.Entity',
                'methodName': 'func_230279_az_', // unmapped as of writing, probably isImmuneToFire or something like that
                'methodDesc': '()Z'
            },
            'transformer': function (method) {
                var ASM = Java.type('net.minecraftforge.coremod.api.ASMAPI');
                var Opcodes = Java.type('org.objectweb.asm.Opcodes');
                var VarInsnNode = Java.type('org.objectweb.asm.tree.VarInsnNode');
                var InsnList = Java.type('org.objectweb.asm.tree.InsnList');


                return injectForEachInsn(method, Opcodes.IRETURN, function (target) {
                    var newInstructions = new InsnList();

                    newInstructions.add(new VarInsnNode(Opcodes.ALOAD, 0));
                    newInstructions.add(ASM.buildMethodCall(
                        "vazkii/quark/base/handler/AsmHooks",
                        "getIsFireResistant",
                        "(ZLnet/minecraft/entity/Entity;)Z",
                        ASM.MethodType.STATIC
                    ));

                    method.instructions.insertBefore(target, newInstructions);

                    return method;
                });
            }
        }
    }
}
